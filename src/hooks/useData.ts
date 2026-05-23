import citiesRaw from "../data/cities.json";
import type {
  City,
  Place,
  Activity,
  ItineraryTransfer,
  ItineraryItem,
  WorkBlock,
  EatBlock,
} from "../types";

const placeModules = import.meta.glob("../data/places/*.json", {
  eager: true,
}) as Record<string, { default: Place[] }>;

const itineraryModules = import.meta.glob("../data/itinerary/*.json", {
  eager: true,
}) as Record<string, { default: ItineraryItem[] }>;

export const cities: City[] = citiesRaw as City[];

export const places: Place[] = Object.values(placeModules).flatMap(
  (mod) => mod.default ?? (mod as unknown as Place[]),
);

export const itineraryItems: ItineraryItem[] = Object.entries(
  itineraryModules,
).flatMap(([path, mod]) => {
  const match = path.match(/(\d{4}-\d{2}-\d{2})\.json$/);
  const date = match ? match[1] : "";
  const items: ItineraryItem[] =
    mod.default ?? (mod as unknown as ItineraryItem[]);
  return items.map((item) => ({ ...item, date }));
});

export const availableDates: string[] = [
  ...new Set(itineraryItems.map((item) => item.date)),
].sort();

export function isTransferRef(item: ItineraryItem): item is ItineraryTransfer {
  return item.type === "transfer";
}

export function isWorkBlock(item: ItineraryItem): item is WorkBlock {
  return item.type === "works";
}

export function isEatBlock(item: ItineraryItem): item is EatBlock {
  return (
    item.type === "breakfast" ||
    item.type === "lunch" ||
    item.type === "dinner"
  );
}

export function getItineraryItemsForDay(date: string): ItineraryItem[] {
  return itineraryItems.filter((item) => item.date === date);
}

export function getPlacesByCity(cityId: string): Place[] {
  return places.filter((p) => p.cityId === cityId);
}

export function getPlaceById(id: string): Place | undefined {
  return places.find((p) => p.id === id);
}

export function getCityById(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}

/** Returns all cities in order (as defined in cities.json) - used for the city-route map. */
export function getCityRoute(): City[] {
  return cities;
}

/**
 * Calculates nights per city derived from transfer events in the itinerary.
 * Logic: sort transfers by date; the origin city gets the days before the first
 * transfer, each destination city gets the days from its arrival until the next
 * transfer departs. Segments are summed when the same city is visited more than
 * once (e.g. Atenas 3 noches + paso el mismo día al volver de Mykonos).
 */
export function getNightsByCity(): Record<string, number> {
  const transferRefs = itineraryItems
    .filter(isTransferRef)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (transferRefs.length === 0) return {};

  const nights: Record<string, number> = {};

  const allDates = availableDates;

  const firstRef = transferRefs[0];
  nights[firstRef.fromCityId] = allDates.filter(
    (d) => d < firstRef.date,
  ).length;

  for (let i = 0; i < transferRefs.length; i++) {
    const ref = transferRefs[i];
    const nextDate =
      i < transferRefs.length - 1 ? transferRefs[i + 1].date : null;

    const segmentNights = nextDate
      ? allDates.filter((d) => d >= ref.date && d < nextDate).length
      : allDates.filter((d) => d >= ref.date).length;

    nights[ref.toCityId] = (nights[ref.toCityId] ?? 0) + segmentNights;
  }

  return nights;
}

/** Returns a map of placeId → number of times it appears in the itinerary. */
export function getItineraryCountByPlace(): Record<string, number> {
  return itineraryItems
    .filter(
      (item): item is Activity =>
        !isTransferRef(item) && !isWorkBlock(item) && !isEatBlock(item),
    )
    .reduce<Record<string, number>>((acc, a) => {
      acc[a.placeId] = (acc[a.placeId] ?? 0) + 1;
      return acc;
    }, {});
}

export function getMapPointsForDay(date: string) {
  return getItineraryItemsForDay(date)
    .filter(
      (item): item is Activity =>
        !isTransferRef(item) && !isWorkBlock(item) && !isEatBlock(item),
    )
    .map((a) => {
      const place = getPlaceById(a.placeId);
      if (!place || place.lat == null || place.lng == null) return null;
      return { lat: place.lat, lng: place.lng, title: place.name };
    })
    .filter(
      (p): p is { lat: number; lng: number; title: string } => p !== null,
    );
}

export function getMapPointsForCity(cityId: string) {
  return getPlacesByCity(cityId)
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({ lat: p.lat!, lng: p.lng!, title: p.name }));
}
