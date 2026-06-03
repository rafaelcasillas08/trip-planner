import { Card, Space, Tag, Typography } from "antd";
import {
  ClockCircleOutlined,
  CommentOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Activity, Place } from "../types";
import CardHeroImage from "./CardHeroImage";

const { Text, Title } = Typography;

type ActivityCardProps = {
  activity: Activity;
  place: Place | undefined;
};

export default function ActivityCard({ activity, place }: ActivityCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      style={{ marginBottom: 12, borderRadius: 12, overflow: "hidden" }}
      styles={{ body: { padding: 0 } }}
    >
      <CardHeroImage
        src={place?.photos[0]}
        alt={place?.name ?? ""}
      />

      <div style={{ padding: 12 }}>
        <Title
          level={5}
          style={{
            margin: "0 0 5px",
            cursor: place ? "pointer" : "default",
            fontSize: 14,
          }}
          onClick={() => place && navigate(`/places/${place.id}`)}
        >
          {place?.name ?? "Lugar desconocido"}
        </Title>

        <Space wrap size={4}>
          {activity.schedule && (
            <Tag
              icon={<ClockCircleOutlined />}
              color="blue"
              style={{ margin: 0, fontSize: 11 }}
            >
              {activity.schedule}
            </Tag>
          )}
          {place?.cost && (
            <Tag color="green" style={{ margin: 0, fontSize: 11 }}>
              {place.cost}
            </Tag>
          )}
        </Space>

        {place?.location && (
          <div style={{ marginTop: 6 }}>
            <a
              href={place.location}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12 }}
            >
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              Ver en Google Maps
            </a>
          </div>
        )}
      </div>

      {activity.comments && (
        <div
          style={{
            padding: "10px 12px 12px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            <CommentOutlined style={{ marginRight: 6 }} />
            {activity.comments}
          </Text>
        </div>
      )}
    </Card>
  );
}
