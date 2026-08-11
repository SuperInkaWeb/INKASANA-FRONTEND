import {
  CalendarOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../app/store/auth.store";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roles, role } = useAuthStore();

  const currentRoles = roles.length > 0 ? roles : role ? [role] : [];
  const isPatient = currentRoles.includes("PATIENT");

  const selectedKey = location.pathname.replace(/^\//, "") || "dashboard";

  const canManageUsers = currentRoles.some((role) =>
    ["OWNER", "ADMIN"].includes(role)
  );

  const canManageDoctors = currentRoles.some((role) =>
    ["OWNER", "ADMIN"].includes(role)
  );

  const canManageSpecialties = currentRoles.some((role) =>
    ["OWNER", "ADMIN"].includes(role)
  );

  const canManagePatients = currentRoles.some((role) =>
    ["OWNER", "ADMIN", "DOCTOR", "THERAPIST", "RECEPTIONIST"].includes(role)
  );

  const canManageBranding = currentRoles.some((role) =>
    ["OWNER", "ADMIN"].includes(role)
  );

  const canManageClinicProfile = currentRoles.some((role) =>
    ["OWNER", "ADMIN"].includes(role)
  );

  const canManageOwnAgenda = currentRoles.includes("DOCTOR");

  const canManageClinicAgenda = currentRoles.some((role) =>
    ["OWNER", "ADMIN"].includes(role)
  );

  const menuItems = isPatient ? [
    { key: "patient/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "patient/appointments", icon: <CalendarOutlined />, label: "Citas" },
    { key: "patient/agenda", icon: <ClockCircleOutlined />, label: "Mi agenda" },
    { key: "patient/marketplace", icon: <ShopOutlined />, label: "Marketplace" },
    { key: "patient/profile", icon: <UserOutlined />, label: "Perfil" },
  ] : [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },

    ...(canManageUsers
      ? [
          {
            key: "users",
            icon: <TeamOutlined />,
            label: "Usuarios",
          },
        ]
      : []),

    ...(canManageSpecialties
      ? [
          {
            key: "specialties",
            icon: <MedicineBoxOutlined />,
            label: "Especialidades",
          },
        ]
      : []),

    ...(canManageDoctors
      ? [
          {
            key: "doctors",
            icon: <MedicineBoxOutlined />,
            label: "Doctores",
          },
        ]
      : []),

    ...(canManagePatients
      ? [
          {
            key: "patients",
            icon: <TeamOutlined />,
            label: "Pacientes",
          },
        ]
      : []),

    ...(canManageOwnAgenda
      ? [
          {
            key: "agenda",
            icon: <ClockCircleOutlined />,
            label: "Mi Agenda",
          },
        ]
      : []),

    ...(canManageClinicAgenda
      ? [
          {
            key: "agenda-clinica",
            icon: <ClockCircleOutlined />,
            label: "Agenda de la Clínica",
          },
           {
            key: "appointments",
            icon: <CalendarOutlined />,
            label: "Citas",
          },
        ]
        
      : []),
       ...(canManageUsers
      ? [
          {
            key: "billing",
            icon: <CreditCardOutlined />,
            label: "Facturación",
          },
        ]
      : []),

    ...(canManageBranding
      ? [
          {
            key: "branding",
            icon: <SettingOutlined />,
            label: "Branding",
          },
        ]
      : []),
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Perfil",
    },
    ...(canManageClinicProfile
      ? [
          {
            key: "my-marketplace",
            icon: <ShopOutlined />,
            label: "Mi Clinica",
          },
          {
            key: "clinic-profile",
            icon: <SettingOutlined />,
            label: "Editar Marketplace",
          },
        ]
      : []),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={260}>
        <div style={{ padding: 20 }}>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            HealthHub 360
          </Title>

          <Text style={{ color: "rgba(255,255,255,0.65)" }}>
            Marketplace Médico
          </Text>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(`/${key}`)}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "white",
            padding: "0 24px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Text strong>{isPatient ? "Portal del paciente" : "Panel administrativo"}</Text>
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
