import {
  CalendarOutlined,
  CheckCircleFilled,
  HeartFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import portalLogo from "../../../assets/branding/inkasana-portal-logo.png";
import citaImage from "../../../assets/cita.png.png";
import telefonoImage from "../../../assets/agarrando un telefono.png";
import cardiologiaImg from "../../../assets/cardiologia.png";
import dermatologiaImg from "../../../assets/dermatologia.png";
import endocrinologiaImg from "../../../assets/endocrinologia.png";
import fisioterapiaImg from "../../../assets/fisioterapia.png";
import ginecologiaImg from "../../../assets/ginecologia.png";
import neurologiaImg from "../../../assets/neurologia.png";
import nutricionImg from "../../../assets/nutricion.png";
import odontologiaImg from "../../../assets/odontologia.png";
import oftalmologiaImg from "../../../assets/oftalmologia.png";
import otorrinolaringologiaImg from "../../../assets/otorrinolaringologia.png";
import pediatriaImg from "../../../assets/pediatria.png";
import psicologiaImg from "../../../assets/psicologia.png";
import psiquiatriaImg from "../../../assets/psiquiatria.png";
import traumatologiaImg from "../../../assets/traumatologia.png";

const { Title, Paragraph, Text } = Typography;

const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: "100vh", background: "#fff", color: "#263746" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.96)", boxShadow: "0 2px 14px #a1acee29" }}>
        <div style={{ maxWidth: 1180, minHeight: 70, margin: "auto", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <Button type="text" onClick={() => scrollToSection("inicio")} style={{ padding: 0, height: "auto" }}>
            <Space size={10}>
              <img src={portalLogo} alt="Logo de Clínica Inkasana" style={{ width: 50, height: 50, borderRadius: 14, objectFit: "contain" }} />
              <span style={{ textAlign: "left" }}>
                <Text strong style={{ display: "block", fontSize: 18, color: "#123f76" }}>Clínica Inkasana</Text>
                <Text style={{ fontSize: 12, color: "#6f7d92" }}>Atención médica cercana</Text>
              </span>
            </Space>
          </Button>

          <Space size="middle" wrap>
            <Button type="text" style={{ color: "#284b76", fontWeight: 600 }} onClick={() => scrollToSection("especialidades")}>Especialidades</Button>
            <Button type="text" style={{ color: "#284b76", fontWeight: 600 }} onClick={() => navigate("/marketplace/clinics")}>Clínicas</Button>
            <Button type="text" style={{ color: "#284b76", fontWeight: 600 }} onClick={() => scrollToSection("blog")}>Blog</Button>
            <Button type="primary" size="large" onClick={() => navigate("/patient/login")}>Iniciar sesión</Button>
          </Space>
        </div>
      </header>

      <section id="inicio" style={{ background: "#f4f8ff", padding: "58px 24px 78px" }}>
        <Row gutter={[46, 40]} align="middle" style={{ maxWidth: 1180, margin: "auto" }}>
          <Col xs={24} lg={13}>
            <Tag color="blue" style={{ borderRadius: 20, padding: "5px 12px", marginBottom: 16 }}>Clínica digital de confianza</Tag>
            <Title style={{ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 1.08, color: "#10213e", marginBottom: 20 }}>Tu salud merece una atención más humana.</Title>
            <Paragraph style={{ fontSize: 18, lineHeight: 1.7, color: "#53627d", maxWidth: 620 }}>
              En Clínica Inkasana encuentras especialistas, atención cercana y una forma sencilla de gestionar tus citas desde un solo lugar.
            </Paragraph>
            <Space size="middle" wrap style={{ marginTop: 16 }}>
              <Button type="primary" size="large" icon={<CalendarOutlined />} onClick={() => navigate("/patient/login")}>Agenda tu cita</Button>
              <Button size="large" onClick={() => navigate("/marketplace/clinics")}>Ver clínicas</Button>
            </Space>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 30, color: "#52627e" }}>
              <span><CheckCircleFilled style={{ color: "#12a594", marginRight: 7 }} />Agenda en línea</span>
              <span><CheckCircleFilled style={{ color: "#12a594", marginRight: 7 }} />Pagos seguros</span>
              <span><CheckCircleFilled style={{ color: "#12a594", marginRight: 7 }} />Atención confiable</span>
            </div>
          </Col>
          <Col xs={24} lg={11}>
            <div style={{ position: "relative", maxWidth: 470, margin: "0 auto" }}>
              <div style={{ position: "absolute", width: 260, height: 260, right: -28, top: -22, borderRadius: "50%", background: "#d9f4ef" }} />
              <Card bordered={false} style={{ position: "relative", borderRadius: 28, boxShadow: "0 22px 55px rgba(24, 57, 111, .15)", overflow: "hidden" }} bodyStyle={{ padding: 0 }}>
                <div style={{ padding: "24px 28px", background: "linear-gradient(135deg, #113e78, #1879b9)", color: "white" }}>
                  <Space align="start" size={14}><img src={portalLogo} alt="" style={{ width: 58, height: 58, objectFit: "contain", background: "white", borderRadius: 16, padding: 5 }} /><div><Text style={{ color: "#cce8ff" }}>Tu espacio de salud</Text><Title level={3} style={{ color: "white", margin: "3px 0 0" }}>Clínica Inkasana</Title></div></Space>
                </div>
                <div style={{ padding: 24, background: "white" }}>
                  <Text strong style={{ fontSize: 16 }}>¿Qué deseas hacer hoy?</Text>
                  <Card size="small" hoverable style={{ marginTop: 16, borderRadius: 14, borderColor: "#d9e8fa" }} onClick={() => navigate("/marketplace/clinics")}><Space size={14}><SafetyCertificateOutlined style={{ fontSize: 25, color: "#1677ff" }} /><div><Text strong>Buscar una clínica</Text><div style={{ color: "#697791", fontSize: 13 }}>Conoce instituciones y servicios</div></div></Space></Card>
                  <Card size="small" hoverable style={{ marginTop: 12, borderRadius: 14, borderColor: "#d9eee9" }} onClick={() => navigate("/patient/login")}><Space size={14}><CalendarOutlined style={{ fontSize: 25, color: "#12a594" }} /><div><Text strong>Gestionar mis citas</Text><div style={{ color: "#697791", fontSize: 13 }}>Consulta tu agenda y recordatorios</div></div></Space></Card>
                </div>
              </Card>
              <Card size="small" style={{ position: "absolute", left: -34, bottom: -28, borderRadius: 15, boxShadow: "0 12px 30px rgba(24, 57, 111, .15)" }}><Space><HeartFilled style={{ color: "#ef5c75", fontSize: 23 }} /><div><Text strong>Atención cercana</Text><div style={{ color: "#71809a", fontSize: 12 }}>Pensada para ti</div></div></Space></Card>
            </div>
          </Col>
        </Row>
      </section>

      <section style={{ maxWidth: 1000, margin: "58px auto", padding: "0 24px", textAlign: "center" }}>
        <Title level={2} style={{ color: "#164f82", fontSize: 32 }}>Un poco sobre nosotros</Title>
        <Paragraph style={{ color: "#51606e", fontSize: 18, lineHeight: 1.8 }}>
          En Clínica Inkasana trabajamos para brindar una atención médica segura, cercana y confiable. Acompañamos a cada paciente desde la prevención hasta su recuperación, con especialistas y herramientas digitales que simplifican su experiencia.
        </Paragraph>
      </section>

      <section style={{ background: "linear-gradient(135deg, #0c5a9e, #1680bd)", padding: "38px 24px" }}>
        <Row gutter={[36, 28]} justify="center" align="middle" style={{ maxWidth: 980, margin: "auto", color: "white" }}>
          <Col xs={24} md={12} style={{ textAlign: "center" }}>
            <img src={citaImage} alt="Agenda una cita" style={{ width: 130, maxWidth: "100%" }} />
            <Title level={3} style={{ color: "white", margin: "8px 0" }}>Agenda tu cita en línea</Title>
            <Paragraph style={{ color: "#e4f4ff" }}>Elige cuándo iniciar sesión para consultar disponibilidad y reservar.</Paragraph>
            <Button onClick={() => navigate("/patient/login")} size="large">Iniciar sesión</Button>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered={false} style={{ borderRadius: 18, boxShadow: "0 14px 35px rgba(0,0,0,.16)" }}>
              <Space direction="vertical" size={13}>
                <Text strong style={{ fontSize: 19 }}>Tu salud, organizada en un solo lugar</Text>
                <span><CheckCircleFilled style={{ color: "#12a594", marginRight: 8 }} />Agenda y recordatorios de tus citas</span>
                <span><CheckCircleFilled style={{ color: "#12a594", marginRight: 8 }} />Especialistas y clínicas disponibles</span>
                <span><CheckCircleFilled style={{ color: "#12a594", marginRight: 8 }} />Pago y seguimiento de tu atención</span>
              </Space>
            </Card>
          </Col>
        </Row>
      </section>

      <section id="especialidades" style={{ maxWidth: 1180, margin: "72px auto", padding: "0 24px" }}>
        <Title level={2} style={{ color: "#164f82", textAlign: "center" }}>Especialidades</Title>
        <Paragraph style={{ textAlign: "center", color: "#64748b", fontSize: 16 }}>Encuentra atención para cada etapa de tu vida.</Paragraph>
        <Row gutter={[22, 22]} style={{ marginTop: 28 }}>
          {[
            ["Cardiología", cardiologiaImg], ["Dermatología", dermatologiaImg], ["Endocrinología", endocrinologiaImg], ["Fisioterapia", fisioterapiaImg], ["Ginecología", ginecologiaImg], ["Neurología", neurologiaImg], ["Nutrición", nutricionImg], ["Odontología", odontologiaImg], ["Oftalmología", oftalmologiaImg], ["Otorrinolaringología", otorrinolaringologiaImg], ["Pediatría", pediatriaImg], ["Psicología", psicologiaImg], ["Psiquiatría", psiquiatriaImg], ["Traumatología", traumatologiaImg],
          ].map(([name, image], index) => (
            <Col xs={24} md={8} key={name}>
              <motion.div
                className="landing-specialty-motion"
                initial={{ opacity: 0, y: 46, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.48, delay: (index % 3) * 0.1, ease: "easeOut" }}
              >
                <div className="landing-specialty-card">
                  <div className="landing-specialty-orb" />
                  <Card hoverable cover={<img src={image} alt={name} style={{ height: 190, objectFit: "cover" }} />} style={{ height: "100%", borderRadius: 16, overflow: "hidden", position: "relative" }}>
                    <Title level={4}>{name}</Title>
                    <Paragraph style={{ color: "#65738a", marginBottom: 0 }}>Conoce la atención especializada que tenemos para ti.</Paragraph>
                  </Card>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>

      <section id="blog" style={{ background: "#eff7ff", padding: "66px 24px" }}>
        <Row gutter={[42, 30]} align="middle" style={{ maxWidth: 1080, margin: "auto" }}>
          <Col xs={24} md={12}>
            <Tag color="blue" style={{ borderRadius: 18, padding: "4px 12px" }}>BLOG DE SALUD</Tag>
            <Title level={2} style={{ color: "#164f82", marginTop: 15 }}>Información para cuidar mejor de ti y de tu familia.</Title>
            <Paragraph style={{ fontSize: 17, color: "#52657e", lineHeight: 1.75 }}>
              Compartimos consejos de prevención, bienestar y orientación sobre las especialidades que pueden ayudarte. Queremos que tomes decisiones informadas para tu salud.
            </Paragraph>
            <Button type="primary" onClick={() => navigate("/patient/login")}>Conocer mi espacio de salud</Button>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "center" }}>
            <div style={{ background: "white", borderRadius: 26, padding: 20, boxShadow: "0 15px 35px rgba(36,87,150,.12)", display: "inline-block" }}>
              <img src={telefonoImage} alt="Salud digital Inkasana" style={{ display: "block", maxWidth: "100%", width: 390 }} />
            </div>
          </Col>
        </Row>
      </section>

      <footer style={{ background: "#102f57", color: "#d9eaff", textAlign: "center", padding: "24px" }}>
        <Space><img src={portalLogo} alt="" style={{ width: 30, height: 30, objectFit: "contain" }} /><Text style={{ color: "#fff" }}>Clínica Inkasana</Text><SafetyCertificateOutlined style={{ color: "#6ee7d8" }} /><HeartFilled style={{ color: "#f17689" }} /></Space>
      </footer>
    </main>
  );
}
