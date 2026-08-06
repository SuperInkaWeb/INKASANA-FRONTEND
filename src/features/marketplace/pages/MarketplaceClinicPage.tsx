import { Button, Carousel, Col, Empty, Row, Space, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import slideOne from "../../../assets/transcurrir 1.jpg";
import slideTwo from "../../../assets/transcurrir 2.jpg";
import hospitalImage from "../../../assets/hospital.jpg";
import { getMarketplaceClinics } from "../api/marketplace.api";
import { ClinicMarketplaceCard } from "../components/ClinicMarketplaceCard";

const { Title, Paragraph, Text } = Typography;
const sectionStyle: React.CSSProperties = { marginTop: 72 };

export function MarketplaceClinicsPage() {
  const navigate = useNavigate();
  const { data: clinics = [], isLoading } = useQuery({ queryKey: ["marketplace-clinics"], queryFn: () => getMarketplaceClinics() });
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const navButton: React.CSSProperties = { color: "#fff" };

  return <div className="marketplace-page" style={{ background: "#fff", minHeight: "100vh", color: "#263746" }}>
    <header style={{ background: "#0868b8", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 16px #003f7729" }}><div style={{ maxWidth: 1180, minHeight: 66, margin: "auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}><Button type="text" onClick={() => navigate("/marketplace/clinics")} style={{ padding: 0, height: "auto", color: "#fff", fontWeight: 700, fontSize: 18 }}>HealthHub 360</Button><Space size="middle" wrap><Button type="text" style={navButton} onClick={() => goTo("clinicas")}>Clínicas</Button><Button type="text" style={navButton} onClick={() => goTo("hospitales")}>Hospitales</Button><Button type="text" style={navButton} onClick={() => goTo("blog")}>Blog</Button></Space></div></header>
    <main style={{ maxWidth: 1180, margin: "auto", padding: "32px 24px 72px" }}>
      <Carousel arrows autoplay autoplaySpeed={4000} effect="fade" className="clinic-carousel"><img alt="Atención médica" src={slideOne} style={{ width: "100%", height: 390, objectFit: "cover", borderRadius: 22 }} /><img alt="Profesionales de salud" src={slideTwo} style={{ width: "100%", height: 390, objectFit: "cover", borderRadius: 22 }} /></Carousel>
      <section style={{ textAlign: "center", maxWidth: 840, margin: "64px auto" }}><Title level={3} style={{ color: "#164f82", fontSize: 28 }}>Un poco sobre nosotros</Title><Paragraph style={{ fontSize: 17, lineHeight: 1.8, color: "#51606e" }}>Somos una organización que selecciona cuidadosamente las mejores clínicas y hospitales certificados por el Ministerio de Salud. Reunimos información clara para que puedas encontrar profesionales, especialidades y horarios de atención con tranquilidad.</Paragraph><Paragraph style={{ fontSize: 17, lineHeight: 1.8, color: "#51606e" }}>Creemos que cuidar la salud debe ser más simple, por eso acercamos instituciones confiables a las personas y familias que necesitan una atención segura, humana y oportuna.</Paragraph></section>
      <section id="clinicas"><Title level={2} style={{ color: "#164f82" }}>Clínicas</Title><Text type="secondary">Contamos con más de 10 clínicas certificadas.</Text><Row gutter={[20, 20]} style={{ marginTop: 24 }}>{!isLoading && clinics.length === 0 ? <Col span={24}><Empty description="Aún no hay clínicas publicadas" /></Col> : clinics.map(clinic => <Col xs={24} sm={12} lg={8} key={clinic.id}><ClinicMarketplaceCard clinic={clinic} /></Col>)}</Row></section>
      <section id="hospitales" style={sectionStyle}><Title level={2} style={{ color: "#164f82" }}>Hospitales</Title><Text type="secondary">Contamos con más de 20 hospitales certificados.</Text><Row gutter={[20, 20]} style={{ marginTop: 24 }}><Col xs={24} sm={12} lg={8}><div style={{ overflow: "hidden", borderRadius: 18, background: "#fff", boxShadow: "0 8px 28px #12304a12" }}><img alt="Hospital certificado" src={hospitalImage} style={{ width: "100%", height: 220, objectFit: "cover" }} /><div style={{ padding: 20 }}><Title level={4}>Hospitales aliados</Title><Paragraph>Conoce instituciones preparadas para acompañarte en cada etapa de tu atención.</Paragraph><Button type="primary" style={{ background: "#0868b8", borderColor: "#0868b8" }} onClick={() => goTo("clinicas")}>Más información</Button><Button type="primary" style={{ marginLeft: 8 }} onClick={() => navigate("/access")}>Iniciar sesión</Button></div></div></Col></Row><Paragraph type="secondary" style={{ marginTop: 16 }}>Los hospitales se mostrarán aquí al estar publicados en el marketplace.</Paragraph></section>
      <section id="blog" style={{ ...sectionStyle, background: "#eef7ff", padding: 36, borderRadius: 22 }}><Title level={2} style={{ color: "#164f82" }}>¿Por qué somos tu mejor opción?</Title><Paragraph>Te ayudamos a encontrar atención certificada, comparar alternativas y organizar tus citas desde un solo lugar. Información clara, profesionales disponibles y menos tiempo de espera para cuidar lo que más importa: tu salud.</Paragraph><Paragraph>En nuestro marketplace puedes revisar instituciones, conocer sus servicios y dar el primer paso para organizar tu cita sin llamadas interminables ni desplazamientos innecesarios. Nuestro objetivo es que tomes decisiones informadas y encuentres la atención que necesitas en el momento adecuado.</Paragraph><Paragraph>Seguiremos sumando contenido útil sobre prevención, bienestar y las especialidades médicas que pueden acompañarte durante cada etapa de tu vida.</Paragraph></section>
    </main>
  </div>;
}
