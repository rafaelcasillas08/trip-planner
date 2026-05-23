import { Tag, Typography } from "antd";
import { ClockCircleOutlined, CommentOutlined } from "@ant-design/icons";
import type { WorkBlock } from "../types";

const { Text, Title } = Typography;

type WorkCardProps = {
  work: WorkBlock;
};

export default function WorkCard({ work }: WorkCardProps) {
  const isAllDay = work.schedule.toLowerCase().includes("todo el día") ||
    work.schedule.toLowerCase().includes("todo el dia");

  return (
    <div
      style={{
        background: "#fffbe6",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderLeft: "3px solid #faad14",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: work.comments ? 8 : 0 }}>
        <span style={{ fontSize: 20 }}>💻</span>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ margin: "0 0 4px", fontSize: 14 }}>
            Trabajo remoto
          </Title>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {isAllDay ? (
              <Tag icon={<ClockCircleOutlined />} color="warning" style={{ margin: 0, fontSize: 11 }}>
                Todo el día
              </Tag>
            ) : (
              <Tag icon={<ClockCircleOutlined />} color="warning" style={{ margin: 0, fontSize: 11 }}>
                {work.schedule}
              </Tag>
            )}
          </div>
        </div>
      </div>

      {work.comments && (
        <div style={{ paddingTop: 8, borderTop: "1px solid #ffe58f" }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            <CommentOutlined style={{ marginRight: 6 }} />
            {work.comments}
          </Text>
        </div>
      )}
    </div>
  );
}
