export type City = {
  id: string;
  name: string;
  country: string;
  coverPhoto?: string;
  lat: number;
  lng: number;
};

export type Place = {
  id: string;
  cityId: string;
  name: string;
  location: string; // Google Maps link
  photos: string[]; // GitHub raw image URLs
  comments: string;
  cost: string;
  transport: string;
  website: string;
  hours: string; // e.g. "9:00 - 18:00"
  timeNeeded: string; // e.g. "2 hrs"
  lat?: number; // optional - for map pin
  lng?: number;
};

export type TransportMode = "train" | "bus" | "plane" | "car" | "ferry";

export type LocalTransfer = {
  schedule: string;
  comments?: string;
};

export type ItineraryTransfer = {
  type: "transfer";
  date: string; // injected at runtime by useData.ts
  fromCityId: string;
  toCityId: string;
  transportMode: TransportMode;
  duration: string; // "3h 35min"
  stationTime?: string; // "07:30"
  departureTime?: string; // "08:10"
  arrivalTime?: string; // "11:45"
  cost?: string;
  comments?: string;
  toStationTransfer?: LocalTransfer;
  toHotelTransfer?: LocalTransfer;
};

export type Activity = {
  type?: "activity";
  id: string;
  placeId: string; // references Place.id
  date: string; // "YYYY-MM-DD"
  schedule: string; // e.g. "9am a 11am"
  comments: string;
};

export type EatType = "breakfast" | "lunch" | "dinner";

export type EatBlock = {
  type: EatType;
  date: string; // injected at runtime by useData.ts
  schedule: string;
  comments?: string;
};

export type WorkBlock = {
  type: "work";
  id: string;
  date: string;
  schedule: string; // "Todo el día" | "9am a 1pm"
  comments: string;
};

export type ItineraryItem = Activity | ItineraryTransfer | WorkBlock | EatBlock;
