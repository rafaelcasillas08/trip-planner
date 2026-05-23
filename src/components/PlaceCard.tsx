import { Tag, Tooltip, Typography } from "antd";
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  RightOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Place } from "../types";
import CardHeroImage from "./CardHeroImage";

const { Text, Title } = Typography;

type PlaceCardProps = {
  place: Place;
  itineraryCount?: number;
};

export default function PlaceCard({
  place,
  itineraryCount = 0,
}: PlaceCardProps) {
  const navigate = useNavigate();

  const statusBadge =
    itineraryCount > 1 ? (
      <Tooltip title={`Agregado ${itineraryCount} veces al itinerario`}>
        <WarningFilled style={{ color: "#faad14", fontSize: 18 }} />
      </Tooltip>
    ) : itineraryCount === 1 ? (
      <Tooltip title="Ya está en el itinerario">
        <CheckCircleFilled style={{ color: "#52c41a", fontSize: 18 }} />
      </Tooltip>
    ) : null;

  return (
    <div
      onClick={() => navigate(`/places/${place.id}`)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      <div style={{ position: "relative" }}>
        <CardHeroImage
          src={place.photos[0]}
          alt={place.name}
        />
        {statusBadge && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {statusBadge}
          </div>
        )}
      </div>

      <div
        style={{
          padding: 12,
          display: "flex",
          gap: 8,
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={5} style={{ margin: "0 0 5px", fontSize: 15 }}>
            {place.name}
          </Title>

          {place.hours && (
            <Text
              type="secondary"
              style={{ fontSize: 12, display: "block", marginBottom: 6 }}
            >
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {place.hours}
            </Text>
          )}

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {place.cost && (
              <Tag
                icon={<DollarOutlined />}
                color="green"
                style={{ margin: 0, fontSize: 11 }}
              >
                {place.cost}
              </Tag>
            )}
            {place.timeNeeded && (
              <Tag
                icon={<FieldTimeOutlined />}
                color="blue"
                style={{ margin: 0, fontSize: 11 }}
              >
                {place.timeNeeded}
              </Tag>
            )}
          </div>
        </div>

        <RightOutlined
          style={{ color: "#bbb", fontSize: 12, marginTop: 4, flexShrink: 0 }}
        />
      </div>
    </div>
  );
}
