import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Space,
  Spin,
  Tag,
  Typography,
  Avatar,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { doctorService } from "../services/doctor.service";
import type { DoctorStatus } from "../types/doctor.types";

const { Title, Text, Paragraph } = Typography;

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: doctor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorService.findById(id as string),
    enabled: !!id,
  });

  const getStatusColor = (value: DoctorStatus) => {
    if (value === "ACTIVE") return "green";
    if (value === "INACTIVE") return "default";
    return "orange";
  };

  const getStatusLabel = (value: DoctorStatus) => {
    if (value === "ACTIVE") return "Activo";
    if (value === "INACTIVE") return "Inactivo";
    return "Suspendido";
  };

  if (isLoading) {
    return (
      <Card>
        <Spin />
      </Card>
    );
  }

  if (isError || !doctor) {
    return (
      <Card>
        <Empty description="No se encontró el doctor" />
        <Button onClick={() => navigate("/doctors")}>Volver</Button>
      </Card>
    );
  }

  const hasSpecialties = doctor.specialties && doctor.specialties.length > 0;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/doctors")}>
        Volver a doctores
      </Button>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space align="center">
            <Avatar
              size={48}
              src={doctor.profileImageUrl || undefined}
              icon={<UserOutlined />}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {doctor.fullName}
              </Title>

              {hasSpecialties ? (
                <Space wrap>
                  {doctor.specialties.map((specialty) => (
                    <Tag key={specialty.id} color="blue">
                      {specialty.name}
                    </Tag>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">Sin especialidades registradas</Text>
              )}
            </div>
          </Space>

          <Tag color={getStatusColor(doctor.status)}>
            {getStatusLabel(doctor.status)}
          </Tag>

          <Paragraph>
            {doctor.bio || "Este doctor aún no tiene biografía profesional."}
          </Paragraph>
        </Space>
      </Card>

      <Card title="Información profesional">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Licencia médica">
            {doctor.licenseNumber || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Especialidades">
            {hasSpecialties ? (
              <Space wrap>
                {doctor.specialties.map((specialty) => (
                  <Tag key={specialty.id} color="blue">
                    {specialty.name}
                  </Tag>
                ))}
              </Space>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Especialidad anterior">
            {doctor.specialty || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Precio de consulta">
            {doctor.consultationPrice != null
              ? `$${doctor.consultationPrice}`
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Duración de consulta">
            {doctor.consultationDurationMinutes
              ? `${doctor.consultationDurationMinutes} minutos`
              : "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Días disponibles">
            {doctor.availableDays && doctor.availableDays.length > 0 ? (
              <Space wrap>
                {doctor.availableDays.map((day) => (
                  <Tag key={day} color="purple">
                    {DAY_LABELS[day] ?? day}
                  </Tag>
                ))}
              </Space>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Horario de atención">
            {doctor.availableStartTime && doctor.availableEndTime
              ? `${doctor.availableStartTime} - ${doctor.availableEndTime}`
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Contacto">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Email">
            <Space>
              <MailOutlined />
              {doctor.email || "N/A"}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Teléfono">
            <Space>
              <PhoneOutlined />
              {doctor.phone || "N/A"}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Auditoría">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID doctor">{doctor.id}</Descriptions.Item>
          <Descriptions.Item label="ID usuario tenant">
            {doctor.tenantUserId}
          </Descriptions.Item>
          <Descriptions.Item label="Creado">
            {doctor.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="Actualizado">
            {doctor.updatedAt}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
}