import { useSearchParams } from "react-router-dom";
import { Col, Row, Select, Typography, Empty } from "antd";
import {
  cities,
  getPlacesByCity,
  getItineraryCountByPlace,
} from "../hooks/useData";
import PlaceCard from "../components/PlaceCard";

const { Title } = Typography;

export default function PlacesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCityId =
    searchParams.get("city") ?? cities[0]?.id ?? "";

  function handleCityChange(cityId: string) {
    localStorage.setItem("selectedCity", cityId);
    setSearchParams({ city: cityId });
  }

  const places = getPlacesByCity(activeCityId);
  const itineraryCount = getItineraryCountByPlace();

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: `${city.name} · ${city.country}`,
  }));

  return (
    <div style={{ paddingBottom: 16 }}>
      <Title level={4} style={{ marginBottom: 12 }}>
        Actividades por ciudad
      </Title>

      <Select
        value={activeCityId}
        onChange={handleCityChange}
        options={cityOptions}
        style={{ width: "100%", marginBottom: 16 }}
        size="large"
      />

      {places.length === 0 ? (
        <Empty
          description="No hay lugares para esta ciudad aún. Agrega entradas al archivo JSON correspondiente."
          style={{ marginTop: 60 }}
        />
      ) : (
        <Row gutter={[0, 12]}>
          {places.map((place) => (
            <Col key={place.id} xs={24}>
              <PlaceCard
                place={place}
                itineraryCount={itineraryCount[place.id] ?? 0}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
