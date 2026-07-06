import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { getMarketplaceDoctor } from "../api/marketplace.api";

const { Title, Text, Paragraph } = Typography;

export function MarketplaceDoctorDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    data: doctor,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["marketplace-doctor", slug],
    queryFn: () => getMarketplaceDoctor(slug!),
    enabled: !!slug,
  });

  const goBackToList = () => {
    navigate("/marketplace/doctors");
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active avatar paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No se pudo cargar el perfil del doctor" />
        <Button onClick={goBackToList}>Volver al listado</Button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="Doctor no encontrado" />
        <Button onClick={goBackToList}>Volver al listado</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Card>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={4}>
              <Avatar
                size={120}
                src={doctor.profileImageUrl || undefined}
                icon={<UserOutlined />}
              />
            </Col>

            <Col xs={24} md={14}>
              <Title level={2} style={{ marginBottom: 4 }}>
                {doctor.displayName}
              </Title>

              {doctor.headline && (
                <Text type="secondary">{doctor.headline}</Text>
              )}

              <br />

              <Space wrap style={{ marginTop: 16 }}>
                {doctor.city && (
                  <Text>
                    <EnvironmentOutlined /> {doctor.city}
                  </Text>
                )}

                {doctor.country && <Text>{doctor.country}</Text>}
              </Space>
            </Col>

            <Col xs={24} md={6}>
              <Card>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {doctor.consultationPrice !== null &&
                    doctor.consultationPrice !== undefined && (
                      <Title level={3} style={{ margin: 0 }}>
                        ${doctor.consultationPrice}
                      </Title>
                    )}

                  {doctor.consultationDurationMinutes && (
                    <Text type="secondary">
                      Duración: {doctor.consultationDurationMinutes} minutos
                    </Text>
                  )}

                  <Button type="primary" block icon={<CalendarOutlined />}>
                    Agendar cita
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Sobre el doctor">
              {doctor.description ? (
                <Paragraph>{doctor.description}</Paragraph>
              ) : (
                <Text type="secondary">
                  Este doctor aún no ha agregado una descripción pública.
                </Text>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Información de atención">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Ciudad">
                  {doctor.city || "No definida"}
                </Descriptions.Item>

                <Descriptions.Item label="País">
                  {doctor.country || "No definido"}
                </Descriptions.Item>

                <Descriptions.Item label="Dirección">
                  {doctor.address || "No definida"}
                </Descriptions.Item>

                <Descriptions.Item label="Precio">
                  {doctor.consultationPrice !== null &&
                  doctor.consultationPrice !== undefined
                    ? `$${doctor.consultationPrice}`
                    : "No definido"}
                </Descriptions.Item>

                <Descriptions.Item label="Duración">
                  {doctor.consultationDurationMinutes
                    ? `${doctor.consultationDurationMinutes} minutos`
                    : "No definida"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Button onClick={goBackToList}>Volver al listado</Button>
      </Space>
    </div>
  );
}