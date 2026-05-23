import { Tag, Typography } from "antd";
import { ClockCircleOutlined, CommentOutlined } from "@ant-design/icons";
import type { EatBlock, EatType } from "../types";

const { Text, Title } = Typography;

const EAT_LABELS: Record<EatType, string> = {
  breakfast: "Desayuno",
  lunch: "Comida",
  dinner: "Cena",
};

const EAT_ICONS: Record<EatType, string> = {
  breakfast: "☕️",
  lunch: "🍽️",
  dinner: "🍴",
};

type EatCardProps = {
  eat: EatBlock;
};

export default function EatCard({ eat }: EatCardProps) {
  return (
    <div
      style={{
        background: "#f6ffed",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderLeft: "3px solid #52c41a",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: eat.comments ? 8 : 0,
        }}
      >
        <span style={{ fontSize: 20 }}>{EAT_ICONS[eat.type]}</span>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: "0 0 4px", fontSize: 14 }}>
            {EAT_LABELS[eat.type]}
          </Title>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Tag
              icon={<ClockCircleOutlined />}
              color="warning"
              style={{ margin: 0, fontSize: 11 }}
            >
              {eat.schedule}
            </Tag>
          </div>
        </div>
      </div>

      {eat.comments && (
        <div style={{ paddingTop: 8, borderTop: "1px solid #b7eb8f" }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            <CommentOutlined style={{ marginRight: 6 }} />
            {eat.comments}
          </Text>
        </div>
      )}
    </div>
  );
}
