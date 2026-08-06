import { Button, Card, Typography } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
const { Title, Text } = Typography;
export function PatientLoginPage() {
  const { loginWithRedirect } = useAuth0();
  const login = () => { localStorage.setItem("auth_flow", "PATIENT"); return loginWithRedirect({ authorizationParams: { redirect_uri: window.location.origin, audience: import.meta.env.VITE_AUTH0_AUDIENCE, scope: "openid profile email", prompt: "login" }, appState: { returnTo: "/patient/dashboard" } }); };
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f5f7fb", padding: 24 }}><Card style={{ width: 430, textAlign: "center" }}><Title level={2}>Tu salud, en un solo lugar</Title><Text type="secondary">Inicia sesión o crea tu cuenta para ver y organizar tus citas.</Text><Button type="primary" size="large" block style={{ marginTop: 28 }} onClick={login}>Iniciar sesión o registrarme</Button></Card></main>;
}
