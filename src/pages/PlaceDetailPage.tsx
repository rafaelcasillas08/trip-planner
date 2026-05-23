import type React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Image, Tag, Typography, Result } from "antd";
import {
  ArrowLeftOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CarOutlined,
  FieldTimeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { getPlaceById, getCityById } from "../hooks/useData";
import { resolvePhotoUrl } from "../utils/photos";

const { Title, Text } = Typography;

type InfoRowProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <span
        style={{ color: "#888", fontSize: 16, marginTop: 1, flexShrink: 0 }}
      >
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text
          type="secondary"
          style={{
            fontSize: 11,
            display: "block",
            marginBottom: 2,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </Text>
        <Text style={{ fontSize: 14 }}>{value}</Text>
      </div>
    </div>
  );
}

export default function PlaceDetailPage() {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();

  const place = getPlaceById(placeId ?? "");
  const city = place ? getCityById(place.cityId) : undefined;

  if (!place) {
    return (
      <Result
        status="404"
        title="Lugar no encontrado"
        subTitle="El lugar que buscas no existe en los datos."
        extra={
          <Button type="primary" onClick={() => navigate("/places")}>
            Volver a explorar
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 14, padding: "0 0" }}
        type="text"
      >
        Volver
      </Button>

      <Title level={3} style={{ marginBottom: 2 }}>
        {place.name}
      </Title>
      {city && (
        <Text type="secondary" style={{ fontSize: 14 }}>
          {city.name}, {city.country}
        </Text>
      )}

      {/* Photo gallery - 2 per row grid */}
      {place.photos.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Image.PreviewGroup>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {place.photos.map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    gridColumn:
                      idx === place.photos.length - 1 &&
                      place.photos.length % 2 !== 0
                        ? "1 / -1"
                        : undefined,
                  }}
                >
                  <Image
                    src={resolvePhotoUrl(url)}
                    width="100%"
                    height={150}
                    style={{
                      objectFit: "cover",
                      borderRadius: 10,
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
      )}

      {/* Info rows */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "0 14px",
          marginTop: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        }}
      >
        {place.comments && (
          <InfoRow
            icon={<MessageOutlined />}
            label="Comentarios"
            value={place.comments}
          />
        )}
        {place.hours && (
          <InfoRow
            icon={<ClockCircleOutlined />}
            label="Horario"
            value={place.hours}
          />
        )}
        {place.timeNeeded && (
          <InfoRow
            icon={<FieldTimeOutlined />}
            label="Duración"
            value={
              <Tag color="blue" style={{ margin: 0 }}>
                {place.timeNeeded}
              </Tag>
            }
          />
        )}
        {place.cost && (
          <InfoRow
            icon={<DollarOutlined />}
            label="Costo"
            value={
              <Tag color="green" style={{ margin: 0 }}>
                {place.cost}
              </Tag>
            }
          />
        )}
        {place.transport && (
          <InfoRow
            icon={<CarOutlined />}
            label="Transporte"
            value={place.transport}
          />
        )}
      </div>

      {/* Action buttons - full width */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 20,
        }}
      >
        {place.location && (
          <Button
            type="primary"
            icon={<EnvironmentOutlined />}
            href={place.location}
            target="_blank"
            rel="noopener noreferrer"
            block
            size="large"
          >
            Abrir en Google Maps
          </Button>
        )}
        {place.website && (
          <Button
            icon={<GlobalOutlined />}
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            block
            size="large"
          >
            Sitio web
          </Button>
        )}
      </div>
    </div>
  );
}
