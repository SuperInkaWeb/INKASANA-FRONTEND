import { EnvironmentOutlined, HeartFilled, SafetyCertificateOutlined, ShopOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Empty, Row, Space, Spin, Tag, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import portalLogo from "../../../assets/branding/inkasana-portal-logo.png";
import clinicDirectoryAttentionImage from "../../../assets/branding/clinic-directory-attention.png";
import { getMarketplaceClinics } from "../api/marketplace.api";

const { Title, Paragraph, Text } = Typography;

export function MarketplaceClinicsPage() {
  const navigate = useNavigate();
  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["marketplace-clinics"],
    queryFn: () => getMarketplaceClinics(),
  });

  const goHomeSection = (section: string) => navigate(`/#${section}`);

  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: "#263746" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.96)", boxShadow: "0 2px 14px #a1acee29" }}>
        <div style={{ maxWidth: 1180, minHeight: 70, margin: "auto", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <Button type="text" onClick={() => navigate("/")} style={{ padding: 0, height: "auto" }}>
            <Space size={10}>
              <img src={portalLogo} alt="Logo de Clínica Inkasana" style={{ width: 50, height: 50, borderRadius: 14, objectFit: "contain" }} />
              <span style={{ textAlign: "left" }}>
                <Text strong style={{ display: "block", fontSize: 18, color: "#123f76" }}>Clínica Inkasana</Text>
                <Text style={{ fontSize: 12, color: "#6f7d92" }}>Atención médica cercana</Text>
              </span>
            </Space>
          </Button>
          <Space size="middle" wrap>
            <Button type="text" style={{ color: "#284b76", fontWeight: 600 }} onClick={() => goHomeSection("especialidades")}>Especialidades</Button>
            <Button type="text" style={{ color: "#1677ff", fontWeight: 700 }}>Clínicas</Button>
            <Button type="text" style={{ color: "#284b76", fontWeight: 600 }} onClick={() => goHomeSection("blog")}>Blog</Button>
            <Button type="primary" size="large" onClick={() => navigate("/patient/login")}>Iniciar sesión</Button>
          </Space>
        </div>
      </header>

      <section style={{ background: "#f4f8ff", padding: "52px 24px 62px" }}>
        <Row gutter={[42, 30]} align="middle" style={{ maxWidth: 1120, margin: "auto" }}>
          <Col xs={24} md={14}>
            <Tag color="blue" style={{ borderRadius: 20, padding: "5px 12px", marginBottom: 15 }}>DIRECTORIO DE SALUD</Tag>
            <Title style={{ color: "#10213e", fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.12, marginBottom: 16 }}>Clínicas para acompañarte en cada paso.</Title>
            <Paragraph style={{ color: "#53627d", fontSize: 18, lineHeight: 1.7, maxWidth: 650 }}>
              Conoce las clínicas registradas en Inkasana, sus servicios y especialistas. Elige la institución que mejor se ajuste a tus necesidades.
            </Paragraph>
            <Space size="middle" wrap style={{ marginTop: 14 }}>
              <Button type="primary" size="large" onClick={() => document.getElementById("clinicas-registradas")?.scrollIntoView({ behavior: "smooth" })}>Ver clínicas registradas</Button>
              <Button size="large" onClick={() => navigate("/")}>Volver al inicio</Button>
            </Space>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: "center" }}>
            <Card bordered={false} style={{ borderRadius: 25, maxWidth: 350, margin: "auto", boxShadow: "0 18px 42px rgba(24,57,111,.13)" }}>
              <img src={clinicDirectoryAttentionImage} alt="Paciente gestionando una cita médica desde su celular" style={{ width: "100%", maxWidth: 265, borderRadius: 16, display: "block", margin: "0 auto" }} />
              <Title level={4} style={{ marginBottom: 4 }}>Atención más simple</Title>
              <Text type="secondary">Revisa información clara antes de elegir.</Text>
            </Card>
          </Col>
        </Row>
      </section>

      <section id="clinicas-registradas" style={{ maxWidth: 1180, margin: "0 auto", padding: "68px 24px 76px" }}>
        <div style={{ textAlign: "center", maxWidth: 710, margin: "0 auto 34px" }}>
          <Title level={2} style={{ color: "#164f82", marginBottom: 8 }}>Clínicas registradas</Title>
          <Paragraph style={{ color: "#64748b", fontSize: 16 }}>Cada clínica tiene su propio perfil, especialidades y horarios de atención.</Paragraph>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: 48 }}><Spin size="large" /></div>
        ) : clinics.length === 0 ? (
          <Empty description="Aún no hay clínicas publicadas" />
        ) : (
          <Row gutter={[24, 24]}>
            {clinics.map((clinic) => (
              <Col xs={24} sm={12} lg={8} key={clinic.id}>
                <div className="landing-specialty-card clinic-directory-card">
                  <div className="landing-specialty-orb" />
                  <Card style={{ height: "100%", borderRadius: 16, overflow: "hidden", position: "relative" }} bodyStyle={{ display: "flex", height: "100%", flexDirection: "column", gap: 16 }}>
                    <Space align="center" size={14}>
                      <Avatar size={68} shape="square" src={clinic.profileImageUrl || undefined} icon={<ShopOutlined />} style={{ background: "#eaf3ff" }} />
                      <div>
                        <Title level={4} style={{ margin: 0, color: "#164f82" }}>{clinic.displayName}</Title>
                        {clinic.headline && <Text type="secondary">{clinic.headline}</Text>}
                      </div>
                    </Space>
                    <Space wrap>
                      {clinic.city && <Tag icon={<EnvironmentOutlined />}>{clinic.city}</Tag>}
                      {clinic.country && <Tag color="blue">{clinic.country}</Tag>}
                    </Space>
                    <Paragraph style={{ color: "#66758c", flex: 1, margin: 0 }}>{clinic.address || "Consulta sus especialidades, profesionales y horarios disponibles."}</Paragraph>
                    <Button type="primary" block onClick={() => navigate(`/marketplace/clinics/${clinic.slug}`)}>Ver clínica</Button>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <footer style={{ background: "#102f57", color: "#d9eaff", textAlign: "center", padding: 24 }}>
        <Space><img src={portalLogo} alt="" style={{ width: 30, height: 30, objectFit: "contain" }} /><Text style={{ color: "#fff" }}>Clínica Inkasana</Text><SafetyCertificateOutlined style={{ color: "#6ee7d8" }} /><HeartFilled style={{ color: "#f17689" }} /></Space>
      </footer>
    </main>
  );
}
