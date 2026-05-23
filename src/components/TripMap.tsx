import { GoogleMap, Marker, Polyline, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

type MapPoint = {
  lat: number;
  lng: number;
  label?: string;
  title?: string;
};

type TripMapProps = {
  points: MapPoint[];
  zoom?: number;
  strokeColor?: string;
  showRoute?: boolean;
};

const containerStyle = { width: "100%", height: "100%" };

export default function TripMap({
  points,
  zoom = 6,
  strokeColor = "#2563eb",
  showRoute = true,
}: TripMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "",
  });

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const pathKey = useMemo(
    () => points.map((p) => `${p.lat},${p.lng}`).join("|"),
    [points],
  );

  const path = useMemo(
    () => points.map((p) => ({ lat: p.lat, lng: p.lng })),
    [points],
  );

  useEffect(() => {
    setActiveIdx(null);
  }, [pathKey]);

  if (!isLoaded) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0", borderRadius: 12 }}>
        Cargando mapa...
      </div>
    );
  }

  const center = points.length
    ? { lat: points[0].lat, lng: points[0].lng }
    : { lat: 48.2082, lng: 16.3738 };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
      {points.map((p, idx) => (
        <Marker
          key={`${pathKey}-${idx}`}
          position={{ lat: p.lat, lng: p.lng }}
          label={p.label ?? `${idx + 1}`}
          onClick={() => setActiveIdx(idx)}
        />
      ))}

      {activeIdx !== null && points[activeIdx]?.title && (
        <InfoWindow
          position={{ lat: points[activeIdx].lat, lng: points[activeIdx].lng }}
          onCloseClick={() => setActiveIdx(null)}
        >
          <div style={{ fontWeight: 600, fontSize: 13 }}>{points[activeIdx].title}</div>
        </InfoWindow>
      )}

      {showRoute && points.length > 1 && (
        <Polyline
          key={pathKey}
          path={path}
          options={{
            strokeColor,
            strokeOpacity: 0.85,
            strokeWeight: 4,
          }}
        />
      )}
    </GoogleMap>
  );
}
