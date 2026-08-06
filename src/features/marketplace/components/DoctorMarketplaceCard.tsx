import { Avatar, Button, Card, Space, Tag, Typography } from "antd";
import { EnvironmentOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import type { MarketplaceDoctor } from "../types/marketplace.types";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const { Title, Text } = Typography;

type Props = {
  doctor: MarketplaceDoctor;
};

export function DoctorMarketplaceCard({ doctor }: Props) {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/marketplace/doctors/${doctor.slug}`);
  };

  return (
    <Card
      hoverable
      style={{
        height: "100%",
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <Space align="center">
        <Avatar
          size={72}
          src={doctor.profileImageUrl || undefined}
          icon={<UserOutlined />}
        />

        <div>
          <Title
            level={5}
            style={{
              margin: 0,
            }}
          >
            {doctor.displayName}
          </Title>
        </div>
      </Space>

      {doctor.headline && (
        <Tag color="green">Especialidad: {doctor.headline}</Tag>
      )}

      <Space wrap>
        {doctor.city && (
          <Tag icon={<EnvironmentOutlined />}>
            {doctor.city}
          </Tag>
        )}

        {doctor.country && (
          <Tag color="blue">
            {doctor.country}
          </Tag>
        )}
      </Space>

      {(doctor.consultationPrice !== null &&
        doctor.consultationPrice !== undefined) ||
      doctor.consultationDurationMinutes ? (
        <Space direction="vertical" size={2}>
          {doctor.consultationPrice !== null &&
            doctor.consultationPrice !== undefined && (
              <Text strong>
                Consulta: S/ {doctor.consultationPrice}
              </Text>
            )}

          {doctor.consultationDurationMinutes && (
            <Text type="secondary">
              Duración: {doctor.consultationDurationMinutes} minutos
            </Text>
          )}
        </Space>
      ) : null}

      {doctor.availableDays && doctor.availableDays.length > 0 && (
        <Space wrap size={4}>
          {doctor.availableDays.map((day) => (
            <Tag key={day} color="purple">
              {DAY_LABELS[day] ?? day}
            </Tag>
          ))}
        </Space>
      )}

      {doctor.availableStartTime && doctor.availableEndTime && (
        <Text type="secondary">
          Horario: {doctor.availableStartTime} - {doctor.availableEndTime}
        </Text>
      )}

      <Button type="primary" block onClick={goToProfile}>
        Ver perfil
      </Button>
    </Card>
  );
}
