import {
  CalendarOutlined,
  DashboardOutlined,
  MedicineBoxOutlined,
  SettingOutlined,
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

  const selectedKey = location.pathname.split("/")[1] || "dashboard";

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

  const menuItems = [
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
          {
            key: "appointments",
            icon: <CalendarOutlined />,
            label: "Citas",
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
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={260}>
        <div style={{ padding: 20 }}>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            Medical SaaS
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
          <Text strong>Panel administrativo</Text>
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}