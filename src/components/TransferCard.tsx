import { Tag, Typography } from "antd";
import {
  ClockCircleOutlined,
  CommentOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ItineraryTransfer, TransportMode } from "../types";
import { getCityById } from "../hooks/useData";

const { Text, Title } = Typography;

const TRANSPORT_LABELS: Record<TransportMode, string> = {
  train: "Tren",
  bus: "Bus",
  plane: "Avión",
  car: "Auto",
  ferry: "Ferry",
};

const TRANSPORT_EMOJI: Record<TransportMode, string> = {
  train: "🚂",
  bus: "🚌",
  plane: "✈️",
  car: "🚗",
  ferry: "⛴️",
};

type TransferCardProps = {
  transfer: ItineraryTransfer;
};

export default function TransferCard({ transfer }: TransferCardProps) {
  const fromCity = getCityById(transfer.fromCityId);
  const toCity = getCityById(transfer.toCityId);
  const hasTicket = !!(transfer.departureTime && transfer.arrivalTime);

  return (
    <div
      style={{
        background: "#f0f5ff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderLeft: "3px solid #4c6ef5",
      }}
    >
      {/* Route header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 22 }}>
          {TRANSPORT_EMOJI[transfer.transportMode]}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={5} style={{ margin: 0, fontSize: 14 }}>
            {fromCity?.name ?? transfer.fromCityId}
            <span style={{ color: "#4c6ef5", margin: "0 6px" }}>→</span>
            {toCity?.name ?? transfer.toCityId}
          </Title>
        </div>
        <Tag color="blue" style={{ margin: 0, flexShrink: 0 }}>
          {TRANSPORT_LABELS[transfer.transportMode]}
        </Tag>
      </div>

      {/* Times row - if ticket booked */}
      {hasTicket ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: transfer.stationTime
              ? "1fr 1fr 1fr"
              : "1fr 1fr",
            gap: 8,
            marginBottom: 8,
          }}
        >
          {transfer.stationTime && (
            <TimeBlock
              label="Estar en estación"
              time={transfer.stationTime}
              accent="#fa8c16"
            />
          )}
          <TimeBlock
            label="Salida"
            time={transfer.departureTime!}
            accent="#4c6ef5"
          />
          <TimeBlock
            label="Llegada"
            time={transfer.arrivalTime!}
            accent="#52c41a"
          />
        </div>
      ) : (
        /* No ticket yet - show estimated duration */
        <div style={{ marginBottom: 8 }}>
          <Tag icon={<ClockCircleOutlined />} color="default">
            {transfer.duration} estimado
          </Tag>
          <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
            Sin ticket confirmado
          </Text>
        </div>
      )}

      {/* Cost + duration tags */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: transfer.comments ? 8 : 0,
        }}
      >
        {transfer.cost && (
          <Tag
            icon={<DollarOutlined />}
            color="green"
            style={{ margin: 0, fontSize: 11 }}
          >
            {transfer.cost}
          </Tag>
        )}
        {hasTicket && (
          <Tag
            icon={<ClockCircleOutlined />}
            color="default"
            style={{ margin: 0, fontSize: 11 }}
          >
            {transfer.duration}
          </Tag>
        )}
      </div>

      {/* Main comments */}
      {transfer.comments && (
        <div style={{ paddingTop: 8, borderTop: "1px solid #d6e4ff" }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            <CommentOutlined style={{ marginRight: 6 }} />
            {transfer.comments}
          </Text>
        </div>
      )}

      {/* To-station sub-transfer */}
      {transfer.toStationTransfer && (
        <LocalTransferBlock
          label="Traslado a la estación"
          data={transfer.toStationTransfer}
          accentColor="#fa8c16"
        />
      )}

      {/* To-hotel sub-transfer */}
      {transfer.toHotelTransfer && (
        <LocalTransferBlock
          label="Traslado al hotel"
          data={transfer.toHotelTransfer}
          accentColor="#52c41a"
        />
      )}
    </div>
  );
}

function LocalTransferBlock({
  label,
  data,
  accentColor,
}: {
  label: string;
  data: { schedule: string; comments?: string };
  accentColor: string;
}) {
  return (
    <div
      style={{
        marginTop: 10,
        paddingTop: 8,
        borderTop: "1px solid #d6e4ff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Tag color="default" style={{ margin: 0, fontSize: 11, borderColor: accentColor, color: accentColor }}>
          {label}
        </Tag>
        <Text style={{ fontSize: 12, color: "#555" }}>{data.schedule}</Text>
      </div>
      {data.comments && (
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
          {data.comments}
        </Text>
      )}
    </div>
  );
}

function TimeBlock({
  label,
  time,
  accent,
}: {
  label: string;
  time: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: "6px 8px",
        textAlign: "center",
        borderTop: `2px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, color: accent }}>{time}</div>
    </div>
  );
}
