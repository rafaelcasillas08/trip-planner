import { useSearchParams } from "react-router-dom";
import { Select, Typography, Space, Empty } from "antd";
import {
  GlobalOutlined,
  CalendarOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import TripMap from "../components/TripMap";
import {
  availableDates,
  cities,
  getCityRoute,
  getMapPointsForCity,
  getMapPointsForDay,
  getNightsByCity,
} from "../hooks/useData";
import { formatDateShort } from "../utils/dates";

const { Text } = Typography;

type MapMode = "cities" | "day" | "places";

const cityIds = new Set(cities.map((c) => c.id));

function parseMode(value: string | null): MapMode {
  if (value === "day" || value === "places") return value;
  return "cities";
}

function parseDate(value: string | null): string {
  if (value && availableDates.includes(value)) return value;
  const stored = localStorage.getItem("mapDate");
  if (stored && availableDates.includes(stored)) return stored;
  return availableDates[0] ?? "";
}

function parseCity(value: string | null): string {
  if (value && cityIds.has(value)) return value;
  const stored = localStorage.getItem("selectedCity");
  if (stored && cityIds.has(stored)) return stored;
  return cities[0]?.id ?? "";
}

export default function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = parseMode(
    searchParams.get("mode") ?? localStorage.getItem("mapMode"),
  );
  const activeDate = parseDate(searchParams.get("date"));
  const activeCityId = parseCity(searchParams.get("city"));

  function updateMapParams(updates: {
    mode?: MapMode;
    date?: string;
    city?: string;
  }) {
    if (updates.mode !== undefined) {
      localStorage.setItem("mapMode", updates.mode);
    }
    if (updates.date !== undefined) {
      localStorage.setItem("mapDate", updates.date);
    }
    if (updates.city !== undefined) {
      localStorage.setItem("selectedCity", updates.city);
    }

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (updates.mode !== undefined) next.set("mode", updates.mode);
      if (updates.date !== undefined) next.set("date", updates.date);
      if (updates.city !== undefined) next.set("city", updates.city);
      return next;
    });
  }

  function handleModeChange(next: MapMode) {
    if (next === "day") {
      updateMapParams({ mode: next, date: activeDate });
    } else if (next === "places") {
      updateMapParams({ mode: next, city: activeCityId });
    } else {
      updateMapParams({ mode: next });
    }
  }

  function handleDateChange(date: string) {
    updateMapParams({ mode: "day", date });
  }

  function handleCityChange(cityId: string) {
    updateMapParams({ mode: "places", city: cityId });
  }

  const nightsMap = getNightsByCity();

  const cityPoints = getCityRoute().map((c) => {
    const nights = nightsMap[c.id];
    const label = nights === undefined ? "?" : nights === 0 ? "½" : `${nights}`;
    return {
      lat: c.lat,
      lng: c.lng,
      title: `${c.name} · ${nights === undefined ? "sin datos" : nights === 0 ? "paso" : `${nights} noche${nights !== 1 ? "s" : ""}`}`,
      label,
    };
  });

  const dayPoints = getMapPointsForDay(activeDate).map((p, idx) => ({
    ...p,
    label: `${idx + 1}`,
  }));

  const placePoints = getMapPointsForCity(activeCityId);

  const activePoints =
    mode === "cities"
      ? cityPoints
      : mode === "day"
        ? dayPoints
        : placePoints;

  const dateOptions = availableDates.map((d) => ({
    value: d,
    label: formatDateShort(d),
  }));

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: `${city.name} · ${city.country}`,
  }));

  const emptyDescription =
    mode === "day"
      ? "No hay lugares con coordenadas para este día."
      : mode === "places"
        ? "No hay lugares con coordenadas para esta ciudad."
        : "No hay ciudades con coordenadas en cities.json.";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Controls */}
      <div style={{ marginBottom: 12 }}>
        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            background: "#e8e8e8",
            borderRadius: 8,
            padding: 3,
            marginBottom: 12,
          }}
        >
          {(
            [
              { key: "cities" as const, icon: <GlobalOutlined />, label: "Ruta" },
              {
                key: "day" as const,
                icon: <CalendarOutlined />,
                label: "Del día",
              },
              {
                key: "places" as const,
                icon: <CompassOutlined />,
                label: "Por ciudad",
              },
            ] as const
          ).map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              style={{
                flex: 1,
                padding: "6px 4px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: mode === key ? 600 : 400,
                fontSize: 12,
                background: mode === key ? "#fff" : "transparent",
                color: mode === key ? "#1677ff" : "#595959",
                boxShadow:
                  mode === key ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {mode === "day" && (
          <Space>
            <CalendarOutlined style={{ color: "#888" }} />
            <Select
              value={activeDate}
              onChange={handleDateChange}
              options={dateOptions}
              style={{ width: 150 }}
              disabled={availableDates.length === 0}
            />
          </Space>
        )}

        {mode === "places" && (
          <Space style={{ width: "100%" }}>
            <CompassOutlined style={{ color: "#888" }} />
            <Select
              value={activeCityId}
              onChange={handleCityChange}
              options={cityOptions}
              style={{ flex: 1, minWidth: 0 }}
              disabled={cities.length === 0}
            />
          </Space>
        )}
      </div>

      {/* Map area */}
      {activePoints.length === 0 ? (
        <Empty description={emptyDescription} style={{ marginTop: 60 }} />
      ) : (
        <div
          style={{
            flex: 1,
            borderRadius: 14,
            overflow: "hidden",
            minHeight: 380,
          }}
        >
          <TripMap
            key={
              mode === "day"
                ? `day-${activeDate}`
                : mode === "places"
                  ? `places-${activeCityId}`
                  : "cities"
            }
            points={activePoints}
            zoom={mode === "cities" ? 6 : 13}
            strokeColor={mode === "cities" ? "#2563eb" : "#16a34a"}
            showRoute={mode !== "places"}
          />
        </div>
      )}

      {mode === "cities" && cityPoints.length > 0 && (
        <div
          style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}
        >
          {cityPoints.map((p, idx) => (
            <Text key={idx} style={{ fontSize: 12, color: "#666" }}>
              <strong style={{ color: "#1677ff" }}>{p.label}</strong> {p.title}
              {idx < cityPoints.length - 1 && " →"}
            </Text>
          ))}
        </div>
      )}
    </div>
  );
}
