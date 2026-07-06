import { Button, Card, Descriptions, Space, Typography } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "../../../app/store/auth.store";
import { setAuthToken } from "../../../shared/api/api";

const { Title, Text } = Typography;

export function ProfilePage() {
  const { user, logout, isLoading } = useAuth0();
  const { token, role, roles, userId, orgId, schema, scope, logout: localLogout } =
    useAuthStore();

  if (isLoading) {
    return <div>Cargando perfil...</div>;
  }

  const handleLogout = () => {
    setAuthToken(null);
    localLogout();

    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={3}>Perfil de usuario</Title>
            <Text type="secondary">
              Información de Auth0 y sesión interna del tenant.
            </Text>
          </div>

          <Descriptions title="Usuario Auth0" bordered column={1}>
            <Descriptions.Item label="Nombre">
              {user?.name || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              {user?.email || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Auth0 ID">
              {user?.sub || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Email verificado">
              {user?.email_verified ? "Sí" : "No"}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Sesión interna" bordered column={1}>
            <Descriptions.Item label="User ID">
              {userId || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Organization ID">
              {orgId || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Schema">
              {schema || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Rol">
              {role || roles?.[0] || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Scope">
              {scope || "-"}
            </Descriptions.Item>

            <Descriptions.Item label="Token interno">
              {token ? "Activo" : "No disponible"}
            </Descriptions.Item>
          </Descriptions>

          <Button danger onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Space>
      </Card>
    </div>
  );
}