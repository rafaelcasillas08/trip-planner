import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import PlacesPage from "./pages/PlacesPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import ItineraryPage from "./pages/ItineraryPage";
import MapPage from "./pages/MapPage";
import { availableDates } from "./hooks/useData";

export default function App() {
  const firstDate = availableDates[0] ?? "";

  return (
    <HashRouter basename="/trip-planner">
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/places" replace />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/places/:placeId" element={<PlaceDetailPage />} />
          <Route
            path="/itinerary"
            element={
              firstDate ? (
                <Navigate to={`/itinerary/${firstDate}`} replace />
              ) : (
                <ItineraryPage />
              )
            }
          />
          <Route path="/itinerary/:date" element={<ItineraryPage />} />
          <Route path="/map" element={<MapPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
