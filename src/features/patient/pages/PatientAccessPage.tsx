import { Button, Card, Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/store/auth.store";
import patientImage from "../../../assets/usuario.png";
import clinicImage from "../../../assets/clinica.jpg";
import { setAuthToken } from "../../../shared/api/api";

const { Title, Text } = Typography;

export function PatientAccessPage() {
  const navigate = useNavigate();
  const { logout: logoutInternal } = useAuthStore();
  const enterClinic = () => {
    setAuthToken(null);
    logoutInternal();
    localStorage.removeItem("auth_flow");
    localStorage.removeItem("organization_slug");
    navigate("/login");
  };

  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "linear-gradient(135deg,#edf7ff,#fff)" }}><section style={{ width: 760, maxWidth: "100%", textAlign: "center" }}><Title style={{ color: "#0868b8", marginBottom: 4 }}>HealthHub 360</Title><Title level={2}>¿Cuál es tu rol?</Title><Text type="secondary">Dinos cómo planeas usar la plataforma para personalizar tu experiencia.</Text><Row gutter={[24, 24]} style={{ marginTop: 32 }}><Col xs={24} md={12}><Card hoverable cover={<img src={patientImage} alt="Paciente" style={{ height: 185, objectFit: "cover" }} />}><Title level={4}>Soy paciente</Title><Text type="secondary">Organiza tus citas, agenda y recordatorios.</Text><Button type="primary" block size="large" style={{ marginTop: 20 }} onClick={() => navigate("/patient/login")}>Continuar</Button></Card></Col><Col xs={24} md={12}><Card hoverable cover={<img src={clinicImage} alt="Clínica" style={{ height: 185, objectFit: "cover" }} />}><Title level={4}>Soy clínica</Title><Text type="secondary">Accede a la administración de tu organización.</Text><Button type="primary" block size="large" style={{ marginTop: 20 }} onClick={enterClinic}>Continuar</Button></Card></Col></Row></section></main>;
}
