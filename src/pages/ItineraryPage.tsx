import { useParams, useNavigate } from "react-router-dom";
import { Select, Typography, Empty, Tag, Space } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import {
  availableDates,
  getItineraryItemsForDay,
  getPlaceById,
  isTransferRef,
  isWorkBlock,
  isEatBlock,
} from "../hooks/useData";
import { formatDateLabel, formatDateShort } from "../utils/dates";
import ActivityCard from "../components/ActivityCard";
import TransferCard from "../components/TransferCard";
import WorkCard from "../components/WorkCard";
import EatCard from "../components/EatCard";

const { Title, Text } = Typography;

export default function ItineraryPage() {
  const { date } = useParams<{ date?: string }>();
  const navigate = useNavigate();

  const activeDate =
    date && availableDates.includes(date) ? date : availableDates[0] ?? "";

  // Persist the active date so the nav tab can restore it
  if (activeDate) localStorage.setItem("selectedDate", activeDate);

  const items = getItineraryItemsForDay(activeDate);

  const activityCount = items.filter((i) => !isTransferRef(i) && !isWorkBlock(i) && !isEatBlock(i)).length;
  const transferCount = items.filter((i) => isTransferRef(i)).length;
  const workCount = items.filter((i) => isWorkBlock(i)).length;
  const eatCount = items.filter((i) => isEatBlock(i)).length;

  const selectOptions = availableDates.map((d) => ({
    value: d,
    label: formatDateShort(d),
  }));

  function handleDateChange(value: string) {
    localStorage.setItem("selectedDate", value);
    navigate(`/itinerary/${value}`);
  }

  if (availableDates.length === 0) {
    return (
      <Empty
        description="No hay días en el itinerario. Agrega archivos JSON en src/data/itinerary/."
        style={{ marginTop: 80 }}
      />
    );
  }

  function buildCountLabel() {
    const parts: string[] = [];
    if (activityCount > 0)
      parts.push(`${activityCount} actividad${activityCount !== 1 ? "es" : ""}`);
    if (transferCount > 0)
      parts.push(`${transferCount} traslado${transferCount !== 1 ? "s" : ""}`);
    if (eatCount > 0)
      parts.push(`${eatCount} comida${eatCount !== 1 ? "s" : ""}`);
    if (workCount > 0)
      parts.push(`${workCount} trabajo${workCount !== 1 ? "s" : ""}`);
    return parts.join(" · ");
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Itinerario
        </Title>

        <Space>
          <CalendarOutlined />
          <Select
            value={activeDate}
            onChange={handleDateChange}
            options={selectOptions}
            style={{ width: 170 }}
          />
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 15 }}>
          {formatDateLabel(activeDate)}
        </Text>
        {items.length > 0 && (
          <Tag style={{ marginLeft: 10 }} color="blue">
            {buildCountLabel()}
          </Tag>
        )}
      </div>

      {items.length === 0 ? (
        <Empty
          description="No hay actividades para este día. Edita el archivo JSON correspondiente."
          style={{ marginTop: 60 }}
        />
      ) : (
        items.map((item, idx) =>
          isTransferRef(item) ? (
            <TransferCard
              key={idx}
              transfer={item}
            />
          ) : isWorkBlock(item) ? (
            <WorkCard key={item.id} work={item} />
          ) : isEatBlock(item) ? (
            <EatCard key={idx} eat={item} />
          ) : (
            <ActivityCard
              key={item.id}
              activity={item}
              place={getPlaceById(item.placeId)}
            />
          )
        )
      )}
    </div>
  );
}
