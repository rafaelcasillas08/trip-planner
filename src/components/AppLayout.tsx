import type React from "react";
import {
  CompassOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const NAV_HEIGHT = 60;

type NavItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  {
    key: "places",
    icon: <CompassOutlined />,
    label: "Actividades",
    path: "/places",
  },
  {
    key: "itinerary",
    icon: <CalendarOutlined />,
    label: "Itinerario",
    path: "/itinerary",
  },
  { key: "map", icon: <EnvironmentOutlined />, label: "Mapa", path: "/map" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname.startsWith("/itinerary")
    ? "itinerary"
    : location.pathname.startsWith("/map")
    ? "map"
    : "places";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "#f5f5f5",
      }}
    >
      {/* Fixed top header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          background: "#001529",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          zIndex: 100,
          flexShrink: 0,
        }}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
          Europa 2026
        </span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>
          Honey Moon
        </span>
      </header>

      {/* Scrollable content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: 52,
          marginBottom: NAV_HEIGHT,
          paddingBottom: 16,
        }}
      >
        <div style={{ padding: "16px 16px 0", height: "100%" }}>
          <Outlet />
        </div>
      </main>

      {/* Fixed bottom nav */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: NAV_HEIGHT,
          background: "#fff",
          borderTop: "1px solid #e8e8e8",
          display: "flex",
          zIndex: 100,
        }}
      >
        {navItems.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.key === "places") {
                  const city = localStorage.getItem("selectedCity");
                  navigate(city ? `/places?city=${city}` : "/places");
                } else if (item.key === "itinerary") {
                  const date = localStorage.getItem("selectedDate");
                  navigate(date ? `/itinerary/${date}` : "/itinerary");
                } else if (item.key === "map") {
                  const params = new URLSearchParams();
                  const mode = localStorage.getItem("mapMode");
                  const mapDate = localStorage.getItem("mapDate");
                  const selectedCity = localStorage.getItem("selectedCity");
                  if (
                    mode === "day" ||
                    mode === "cities" ||
                    mode === "places"
                  ) {
                    params.set("mode", mode);
                  }
                  if (mapDate) params.set("date", mapDate);
                  if (mode === "places" && selectedCity) {
                    params.set("city", selectedCity);
                  }
                  const q = params.toString();
                  navigate(q ? `/map?${q}` : "/map");
                } else {
                  navigate(item.path);
                }
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                border: "none",
                background: "none",
                cursor: "pointer",
                color: isActive ? "#1677ff" : "#8c8c8c",
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                padding: 0,
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
