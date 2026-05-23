/** @typedef {{ lat: number; lng: number }} Coords */

const PATTERNS = [
  // Pin position (most accurate)
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
  // Map center / place marker
  /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  // Query params
  /[?&]q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  /[?&]ll=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
  /[?&]center=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
];

/**
 * @param {string} url
 * @returns {Coords | null}
 */
export function extractCoordsFromUrl(url) {
  if (!url?.trim()) return null;

  let decoded = url;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    decoded = url;
  }

  for (const pattern of PATTERNS) {
    const match = decoded.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
}

/**
 * @param {string} url
 */
export function isGoogleMapsUrl(url) {
  if (!url?.trim()) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.includes("google.") ||
      host.includes("goo.gl") ||
      host.includes("maps.app")
    );
  } catch {
    return false;
  }
}

/**
 * @param {Coords} a
 * @param {Coords} b
 * @returns {number} distance in meters
 */
export function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
