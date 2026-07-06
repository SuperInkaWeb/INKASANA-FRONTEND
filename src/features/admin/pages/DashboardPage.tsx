import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { getPatients } from "../../patients/api/patients.api";
import { doctorService } from "../../doctors/services/doctor.service";
import { brandingService } from "../../branding/services/branding.service";

const { Title, Text } = Typography;

function getRecentItems<T extends { createdAt: string }>(items: T[], limit = 5) {
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export function DashboardPage() {
  const navigate = useNavigate();

  const {
    data: branding,
    isLoading: loadingBranding,
    isError: isBrandingError,
  } = useQuery({
    queryKey: ["dashboard", "branding"],
    queryFn: () => brandingService.getBranding(),
  });

  const {
    data: patients = [],
    isLoading: loadingPatients,
    isError: isPatientsError,
  } = useQuery({
    queryKey: ["dashboard", "patients"],
    queryFn: () => getPatients(),
  });

  const {
    data: doctors = [],
    isLoading: loadingDoctors,
    isError: isDoctorsError,
  } = useQuery({
    queryKey: ["dashboard", "doctors"],
    queryFn: () => doctorService.findAll(),
  });

  const activePatients = patients.filter((p) => p.status === "ACTIVE").length;
  const inactivePatients = patients.filter(
    (p) => p.status === "INACTIVE"
  ).length;

  const activeDoctors = doctors.filter((d) => d.status === "ACTIVE").length;
  const inactiveDoctors = doctors.filter((d) => d.status === "INACTIVE").length;

  const recentPatients = getRecentItems(patients);
  const recentDoctors = getRecentItems(doctors);

  const hasError = isPatientsError || isDoctorsError || isBrandingError;

  return (
    <>
      <Title level={2}>Dashboard</Title>
      <Text>Resumen general del marketplace médico.</Text>

      {hasError && (
        <Alert
          type="error"
          showIcon
          style={{ marginTop: 16 }}
          message="No se pudieron cargar todos los datos del dashboard"
        />
      )}

      <Card style={{ marginTop: 24 }} loading={loadingBranding}>
        <Space align="center" size="large">
          <Avatar
            size={72}
            src={branding?.logoUrl || undefined}
            icon={!branding?.logoUrl ? <MedicineBoxOutlined /> : undefined}
          />

          <div>
            <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
              {branding?.clinicName || "Organización médica"}
            </Title>

            <Text type="secondary">
              {branding?.slogan || "Panel administrativo del tenant médico"}
            </Text>

            <br />

            <Text>
              {branding?.city || "Ciudad no configurada"}
              {branding?.country ? `, ${branding.country}` : ""}
            </Text>

            <br />

            <Text type="secondary">
              {branding?.contactEmail || "Correo no configurado"}
              {branding?.contactPhone ? ` | ${branding.contactPhone}` : ""}
            </Text>
          </div>
        </Space>
      </Card>

      <Space wrap style={{ marginTop: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/patients")}
        >
          Nuevo paciente
        </Button>

        <Button icon={<UserOutlined />} onClick={() => navigate("/doctors")}>
          Nuevo doctor
        </Button>

        <Button icon={<SettingOutlined />} onClick={() => navigate("/branding")}>
          Configurar branding
        </Button>

        <Button
          icon={<CalendarOutlined />}
          onClick={() => navigate("/appointments")}
        >
          Crear cita
        </Button>
      </Space>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Configuración del sistema">
            <Space direction="vertical">
              <Tag icon={<CheckCircleOutlined />} color="green">
                Onboarding completado
              </Tag>

              <Tag icon={<CheckCircleOutlined />} color="green">
                Branding configurado
              </Tag>

              <Tag
                icon={<CheckCircleOutlined />}
                color={doctors.length > 0 ? "green" : "default"}
              >
                Doctores registrados: {doctors.length}
              </Tag>

              <Tag
                icon={<CheckCircleOutlined />}
                color={patients.length > 0 ? "green" : "default"}
              >
                Pacientes registrados: {patients.length}
              </Tag>

              <Tag color="orange">Citas pendientes de implementación</Tag>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Doctores registrados"
              value={doctors.length}
              loading={loadingDoctors}
              prefix={<UserOutlined />}
            />

            <Text type="success">Activos: {activeDoctors}</Text>
            <br />
            <Text type="secondary">Inactivos: {inactiveDoctors}</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Pacientes registrados"
              value={patients.length}
              loading={loadingPatients}
              prefix={<TeamOutlined />}
            />

            <Text type="success">Activos: {activePatients}</Text>
            <br />
            <Text type="secondary">Inactivos: {inactivePatients}</Text>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Citas registradas"
              value={0}
              loading={false}
              prefix={<CalendarOutlined />}
            />

            <Text type="secondary">Pendiente de implementación</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Últimos pacientes" loading={loadingPatients}>
            <List
              dataSource={recentPatients}
              locale={{ emptyText: "No hay pacientes registrados" }}
              renderItem={(patient) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TeamOutlined />} />}
                    title={patient.fullName}
                    description={
                      <>
                        <Text type="secondary">
                          {patient.identification || "Sin identificación"}
                        </Text>
                        <br />
                        <Tag color={patient.status === "ACTIVE" ? "green" : "red"}>
                          {patient.status}
                        </Tag>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Últimos doctores" loading={loadingDoctors}>
            <List
              dataSource={recentDoctors}
              locale={{ emptyText: "No hay doctores registrados" }}
              renderItem={(doctor) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={doctor.fullName}
                    description={
                      <>
                        <Text type="secondary">
                          {doctor.specialty || "Sin especialidad"}
                        </Text>
                        <br />
                        <Tag color={doctor.status === "ACTIVE" ? "green" : "red"}>
                          {doctor.status}
                        </Tag>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}