import { Button, Card, Form, Input, Space, Typography, message } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../app/store/auth.store";

const { Title, Text } = Typography;

type LoginFormValues = {
  slug: string;
};

const normalizeSlug = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { loginWithRedirect, logout, isAuthenticated, isLoading, error } =
    useAuth0();

  const { isAuthenticated: hasInternalSession, logout: logoutInternal } =
    useAuthStore();

  const slugFromUrl = normalizeSlug(searchParams.get("slug") || "");

  const clearLocalSession = () => {
    localStorage.removeItem("organization_slug");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("token");
    sessionStorage.clear();
    logoutInternal();
  };

  const handleLogin = async (values: LoginFormValues) => {
    try {
      const slug = normalizeSlug(values.slug);

      if (!slug) {
        message.error("Ingresa el slug de la organización");
        return;
      }

      clearLocalSession();
      localStorage.setItem("organization_slug", slug);

      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email",

          // Fuerza a Auth0 a pedir nuevamente usuario/contraseña
          // y evita que use la cuenta anterior.
          prompt: "login",
        },
        appState: {
          returnTo: "/dashboard",
          organizationSlug: slug,
        },
      });
    } catch (err) {
      console.error("ERROR AUTH0 LOGIN:", err);
      message.error("No se pudo iniciar sesión con Auth0");
    }
  };

  const handleForceLogout = () => {
    clearLocalSession();

    logout({
      logoutParams: {
        returnTo: `${window.location.origin}/login`,
      },
    });
  };

  if (isLoading) {
    return <div>Cargando Auth0...</div>;
  }

  if (error) {
    return <div>Error Auth0: {error.message}</div>;
  }

  if (isAuthenticated && hasInternalSession) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        padding: 24,
      }}
    >
      <Card style={{ width: 420, maxWidth: "100%" }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={3}>HealthHub 360</Title>
            <Text type="secondary">
              Ingresa el slug de tu organización para acceder al sistema.
            </Text>
          </div>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            initialValues={{
              slug: slugFromUrl,
            }}
          >
            <Form.Item
              label="Slug de la organización"
              name="slug"
              normalize={normalizeSlug}
              rules={[
                {
                  required: true,
                  message: "Ingresa el slug de la organización",
                },
              ]}
            >
              <Input placeholder="clinica-salud-integral-cuenca" />
            </Form.Item>

            <Button type="primary" block size="large" htmlType="submit">
              Iniciar sesión con Auth0
            </Button>

            <Button
              type="link"
              block
              onClick={() => navigate("/register-organization")}
              style={{ marginTop: 8 }}
            >
              Registrar nueva clínica u hospital
            </Button>

            <Button type="link" danger block onClick={handleForceLogout}>
              Cerrar sesión anterior de Auth0
            </Button>
          </Form>
        </Space>
      </Card>
    </div>
  );
}