#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import {
  extractCoordsFromUrl,
  isGoogleMapsUrl,
  distanceMeters,
} from "./lib/googleMapsUrl.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PLACES_DIR = join(ROOT, "src/data/places");
const CITIES_PATH = join(ROOT, "src/data/cities.json");
const DISTANCE_THRESHOLD_M = 50;
const FETCH_DELAY_MS = 300;

const USAGE = `
Usage:
  node scripts/sync-place-coordinates.mjs [--dry-run | --write] <file>

  <file>  City name (budapest), filename (budapest.json), or path.

Examples:
  npm run sync-coords:dry -- budapest
  npm run sync-coords -- src/data/places/budapest.json
`.trim();

function loadEnv() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function getApiKey() {
  return (
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    ""
  );
}

function parseArgs(argv) {
  const flags = argv.filter((a) => a.startsWith("--"));
  const positional = argv.filter((a) => !a.startsWith("--"));

  const dryRun = flags.includes("--dry-run");
  const write = flags.includes("--write");

  if (dryRun === write) {
    console.error("Specify exactly one of --dry-run or --write.\n");
    console.error(USAGE);
    process.exit(1);
  }

  if (positional.length === 0) {
    console.error("Missing file argument.\n");
    console.error(USAGE);
    process.exit(1);
  }

  return { dryRun, write, fileArg: positional[0] };
}

function resolvePlacesFile(fileArg) {
  const name = basename(fileArg, ".json");
  const candidates = [
    resolve(ROOT, fileArg),
    join(PLACES_DIR, fileArg),
    join(PLACES_DIR, `${name}.json`),
    join(PLACES_DIR, `${basename(fileArg)}`),
  ];

  for (const p of candidates) {
    if (existsSync(p)) return p;
  }

  console.error(`File not found: ${fileArg}`);
  console.error(`Tried:\n${candidates.map((c) => `  - ${c}`).join("\n")}`);
  process.exit(1);
}

function loadCities() {
  const raw = JSON.parse(readFileSync(CITIES_PATH, "utf8"));
  return new Map(raw.map((c) => [c.id, c.name]));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function resolveUrlCoords(url) {
  let coords = extractCoordsFromUrl(url);
  if (coords) return { coords, source: "url" };

  if (!isGoogleMapsUrl(url)) {
    return { coords: null, source: "invalid-url" };
  }

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; trip-planner-sync/1.0)",
      },
    });
    const finalUrl = res.url;
    coords = extractCoordsFromUrl(finalUrl);
    if (coords) return { coords, source: "redirect" };
  } catch (err) {
    return { coords: null, source: "fetch-error", error: String(err) };
  }

  return { coords: null, source: "no-coords" };
}

async function geocode(query, apiKey) {
  const params = new URLSearchParams({
    address: query,
    key: apiKey,
  });
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${params}`
  );
  const data = await res.json();
  if (data.status !== "OK" || !data.results?.[0]) {
    return { coords: null, error: data.status ?? "GEOCODE_FAILED" };
  }
  const { lat, lng } = data.results[0].geometry.location;
  return { coords: { lat, lng }, source: "geocode" };
}

function formatCoords(lat, lng) {
  if (lat == null || lng == null) return "—";
  return `${lat}, ${lng}`;
}

async function main() {
  loadEnv();
  const { dryRun, write, fileArg } = parseArgs(process.argv.slice(2));
  const filePath = resolvePlacesFile(fileArg);
  const cityNames = loadCities();
  const apiKey = getApiKey();

  const places = JSON.parse(readFileSync(filePath, "utf8"));
  if (!Array.isArray(places)) {
    console.error("Expected JSON array of places.");
    process.exit(1);
  }

  console.log(`\n${dryRun ? "[DRY RUN]" : "[WRITE]"} ${filePath}\n`);
  console.log(
    "id".padEnd(40) +
      "status".padEnd(10) +
      "old".padEnd(28) +
      "new".padEnd(28) +
      "source"
  );
  console.log("-".repeat(116));

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const place of places) {
    const id = place.id ?? "?";

    if (!place.location?.trim()) {
      console.log(
        `${id.padEnd(40)}${"SKIP".padEnd(10)}${formatCoords(
          place.lat,
          place.lng
        ).padEnd(28)}${"—".padEnd(28)}no location`
      );
      skipped++;
      continue;
    }

    let result = await resolveUrlCoords(place.location);

    if (!result.coords && apiKey) {
      const cityName = cityNames.get(place.cityId) ?? place.cityId ?? "";
      const query = `${place.name}, ${cityName}`;
      await sleep(FETCH_DELAY_MS);
      const geo = await geocode(query, apiKey);
      if (geo.coords) {
        result = { coords: geo.coords, source: "geocode" };
      } else if (result.source === "no-coords") {
        result = { ...result, geocodeError: geo.error };
      }
    }

    if (!result.coords) {
      const reason =
        result.error ?? result.geocodeError ?? result.source ?? "unknown";
      console.log(
        `${id.padEnd(40)}${"ERROR".padEnd(10)}${formatCoords(
          place.lat,
          place.lng
        ).padEnd(28)}${"—".padEnd(28)}${reason}`
      );
      errors++;
      await sleep(FETCH_DELAY_MS);
      continue;
    }

    const { lat, lng } = result.coords;
    const hadCoords =
      place.lat != null &&
      place.lng != null &&
      Number.isFinite(place.lat) &&
      Number.isFinite(place.lng);

    const changed =
      !hadCoords ||
      distanceMeters({ lat: place.lat, lng: place.lng }, { lat, lng }) >
        DISTANCE_THRESHOLD_M;

    if (!changed) {
      console.log(
        `${id.padEnd(40)}${"OK".padEnd(10)}${formatCoords(
          place.lat,
          place.lng
        ).padEnd(28)}${formatCoords(lat, lng).padEnd(28)}${
          result.source
        } (unchanged)`
      );
      skipped++;
    } else {
      console.log(
        `${id.padEnd(40)}${"UPDATE".padEnd(10)}${formatCoords(
          place.lat,
          place.lng
        ).padEnd(28)}${formatCoords(lat, lng).padEnd(28)}${result.source}`
      );
      place.lat = lat;
      place.lng = lng;
      updated++;
    }

    await sleep(FETCH_DELAY_MS);
  }

  if (write && updated > 0) {
    writeFileSync(filePath, JSON.stringify(places, null, 2) + "\n", "utf8");
    console.log(`\nWrote ${updated} update(s) to ${filePath}`);
  } else if (write && updated === 0) {
    console.log("\nNo changes to write.");
  } else if (dryRun && updated > 0) {
    console.log(
      `\n${updated} place(s) would be updated. Run with --write to apply.`
    );
  }

  console.log(
    `\nSummary: ${updated} update(s), ${skipped} unchanged/skipped, ${errors} error(s)\n`
  );

  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
