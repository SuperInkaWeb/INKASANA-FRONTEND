import { useEffect, useMemo, useState } from "react";
import { 
  Avatar, 
  Button, 
  Card, 
  Carousel, 
  Col, 
  Empty, 
  Input, 
  Modal, 
  Row, 
  Select, 
  Skeleton, 
  Space, 
  Typography, 
  message 
} from "antd";
import { 
  CalendarOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined, 
  CreditCardOutlined,
  SearchOutlined, 
  ShopOutlined, 
  UserOutlined 
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../../app/store/auth.store";

// Importar imágenes generales
import citaImage from "../../../assets/cita.png.png";
import horarioImage from "../../../assets/ver horario.png.png";
import slideOne from "../../../assets/transcurrir 1.png";
import slideTwo from "../../../assets/transcurrir 2.png";
import telefonoImage from "../../../assets/agarrando un telefono.png";
// Importar imágenes de especialidades
import traumatologiaImg from "../../../assets/traumatologia.png";
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

// Importar servicios API
import { 
  getMarketplaceClinic, 
  getMarketplaceClinicDoctors, 
  getMarketplaceDoctorSlots,
  createMarketplaceAppointmentCheckout
} from "../api/marketplace.api";

const { Title, Text, Paragraph } = Typography;

const fallbackSpecialties = [
  "Traumatología", 
  "Cardiología", 
  "Pediatría", 
  "Medicina interna", 
  "Ginecología", 
  "Dermatología"
];

type View = "home" | "doctors" | "booking" | "availability" | "specialty";

// Mapeo de especialidades a imágenes
const specialtyImages: Record<string, string> = {
  "Traumatología": traumatologiaImg,
  "Cardiología": cardiologiaImg,
  "Dermatología": dermatologiaImg,
  "Endocrinología": endocrinologiaImg,
  "Fisioterapia": fisioterapiaImg,
  "Ginecología": ginecologiaImg,
  "Neurología": neurologiaImg,
  "Nutrición": nutricionImg,
  "Odontología": odontologiaImg,
  "Oftalmología": oftalmologiaImg,
  "Otorrinolaringología": otorrinolaringologiaImg,
  "Pediatría": pediatriaImg,
  "Psicología": psicologiaImg,
  "Psiquiatría": psiquiatriaImg,
  "Medicina interna": traumatologiaImg,
};

// Función para obtener la imagen correcta de una especialidad
const getSpecialtyImage = (specialtyName: string): string => {
  return specialtyImages[specialtyName] || traumatologiaImg;
};

export function MarketplaceClinicDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, role, roles } = useAuthStore();
  // Esta página es pública, pero puede abrirse desde cualquier dashboard.
  // Usamos el token persistido como fuente de verdad para no perder el estado
  // visual de la sesión al navegar desde el portal del paciente o de la clínica.
  const hasActiveSession = Boolean(token || localStorage.getItem("access_token"));
  const isPatient = role === "PATIENT" || roles.includes("PATIENT");
  const dashboardPath = isPatient ? "/patient/dashboard" : "/dashboard";
  
  const [view, setView] = useState<View>("home");
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState<string>();
  const [doctor, setDoctor] = useState<any>();
  const [slot, setSlot] = useState<{ date: string; time: string }>();
  const [modal, setModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [activeSpecialty, setActiveSpecialty] = useState("");

  // Al volver desde Mercado Pago, algunos navegadores restauran la página
  // desde su caché con el estado anterior. Nunca dejamos el modal bloqueado.
  useEffect(() => {
    const resetCheckoutState = () => setCheckoutLoading(false);
    window.addEventListener("pageshow", resetCheckoutState);
    return () => window.removeEventListener("pageshow", resetCheckoutState);
  }, []);
  
  const clinicQuery = useQuery({ 
    queryKey: ["marketplace-clinic", slug], 
    queryFn: () => getMarketplaceClinic(slug!), 
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: "always"
  });
  
  const doctorsQuery = useQuery({ 
    queryKey: ["marketplace-clinic-doctors", slug], 
    queryFn: () => getMarketplaceClinicDoctors(slug!), 
    enabled: !!slug 
  });
  
  const slotsQuery = useQuery({ 
    queryKey: ["marketplace-slots", doctor?.doctorId], 
    queryFn: () => getMarketplaceDoctorSlots(
      doctor.doctorId, 
      new Date().toISOString().slice(0, 10), 
      new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 10)
    ), 
    enabled: !!doctor?.doctorId 
  });
  
  const clinic = clinicQuery.data;
  const doctors = doctorsQuery.data ?? [];
  
  const specialties = useMemo(
    () => Array.from(new Set([
      ...fallbackSpecialties, 
      ...doctors.flatMap(item => item.specialties ?? [])
    ])), 
    [doctors]
  );
  
  const filtered = doctors.filter(item => 
    (!name || item.displayName.toLowerCase().includes(name.toLowerCase())) && 
    (!specialty || item.specialties?.includes(specialty))
  );
  
  const appearance = useMemo(() => {
    try { return JSON.parse(clinic?.appearanceConfig || "{}"); } catch { return {}; }
  }, [clinic?.appearanceConfig]);
  const blue = appearance.bookingButton ?? clinic?.buttonColor ?? "#0868b8";
  const pageColor = appearance.pageBackground ?? clinic?.pageColor ?? "#ffffff";
  const subscriptionColor = appearance.subscriptions ?? clinic?.subscriptionColor ?? "#2438b9";
  const subscriptionTheme = ["classic", "graphite", "metallic-blue"].includes(appearance.subscriptionTheme)
    ? appearance.subscriptionTheme
    : "classic";
  const carouselImages = [
    clinic?.carouselImageUrl1 ?? clinic?.coverImageUrl ?? slideOne,
    clinic?.carouselImageUrl2 ?? clinic?.coverImageUrl ?? slideTwo,
  ];
  const goToBilling = (planCode: string) => {
    if (!clinic?.slug) {
      return;
    }

    const returnTo = `/billing?plan=${encodeURIComponent(planCode)}&checkout=1`;
    if (!hasActiveSession) {
      Modal.confirm({
        title: "Inicia sesión para elegir un plan",
        content: "Primero debes iniciar sesión con la cuenta administradora de la clínica para contratar una suscripción.",
        okText: "Iniciar sesión",
        cancelText: "Ahora no",
        onOk: () => navigate(
          `/login?slug=${encodeURIComponent(clinic.slug)}&returnTo=${encodeURIComponent(returnTo)}`
        ),
      });
      return;
    }

    navigate(
      `/login?slug=${encodeURIComponent(clinic.slug)}&returnTo=${encodeURIComponent(returnTo)}`
    );
  };
  
  const home = () => { 
    setView("home"); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };
  
  const selectDoctor = (item: any, target: View) => { 
    setDoctor(item); 
    setView(target); 
  };

  const startAppointmentCheckout = async () => {
    if (!doctor?.slug || !doctor?.doctorId || !slot) return;
    if (!isPatient) {
      Modal.confirm({
        title: "Inicia sesión para pagar tu consulta",
        content: "Las citas solo pueden reservarse con una cuenta de paciente. Si eres clínica o profesional, usa el botón Iniciar sesión del menú.",
        okText: "Ingresar como paciente",
        cancelText: "Ahora no",
        onOk: () => {
          setModal(false);
          navigate("/patient/login");
        },
      });
      return;
    }

    try {
      setCheckoutLoading(true);
      const checkout = await createMarketplaceAppointmentCheckout(doctor.slug, {
        doctorId: doctor.doctorId,
        date: slot.date,
        time: slot.time,
      });
      window.location.assign(checkout.url);
    } catch (error) {
      console.error("No se pudo iniciar el pago de la consulta:", error);
      message.error("No fue posible iniciar el pago. Verifica que el horario siga disponible.");
      setCheckoutLoading(false);
    }
  };
  
  if (clinicQuery.isLoading) {
    return (
      <div style={{ padding: 32 }}>
        <Skeleton active />
      </div>
    );
  }
  
  if (!clinic || clinicQuery.isError) {
    return (
      <div style={{ padding: 32 }}>
        <Empty description="No se pudo cargar la institución" />
        <Button onClick={() => navigate("/marketplace/clinics")}>
          Volver
        </Button>
      </div>
    );
  }

  const doctorCards = (target: "booking" | "availability") => 
    doctorsQuery.isLoading ? (
      <Skeleton active />
    ) : filtered.length ? (
      <Row gutter={[22, 22]}>
        {filtered.map(item => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card 
              hoverable 
              cover={
                item.profileImageUrl ? (
                  <img 
                    src={item.profileImageUrl} 
                    alt={item.displayName} 
                    style={{ 
                      height: 215, 
                      width: "100%", 
                      objectFit: "contain", 
                      background: "#f5f8fc" 
                    }} 
                  />
                ) : undefined
              }
            >
              <Card.Meta 
                avatar={<Avatar icon={<UserOutlined />} />} 
                title={item.displayName} 
                description={(item.specialties ?? []).join(" · ") || item.headline} 
              />
              <Button 
                style={{ 
                  marginTop: 16, 
                  background: blue, 
                  borderColor: blue 
                }} 
                block 
                type="primary" 
                onClick={() => selectDoctor(item, target)}
              >
                {target === "availability" ? "Ver disponibilidad" : "Elegir médico"}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    ) : (
      <Empty description="No se encontraron médicos" />
    );

  const schedule = (
    <Card 
      title={
        <Space>
          <Avatar src={doctor?.profileImageUrl} icon={<UserOutlined />} />
          <span>{doctor?.displayName}</span>
        </Space>
      } 
      extra={
        <Button onClick={() => setView("doctors")}>
          Cambiar médico
        </Button>
      }
    >
      <Text type="secondary">
        {(doctor?.specialties ?? []).join(" · ")}
      </Text>
      
      <Title level={4} style={{ marginTop: 24 }}>
        Horarios disponibles
      </Title>

      {slotsQuery.isLoading ? (
        <Skeleton active />
      ) : (slotsQuery.data ?? []).some(day => day.slots.some(item => item.available)) ? (
        (slotsQuery.data ?? []).map(day => {
          const available = day.slots.filter(item => item.available);
          
          return available.length ? (
            <div key={day.date} style={{ marginBottom: 24 }}>
              <Text strong>
                {new Date(`${day.date}T00:00:00`).toLocaleDateString("es-PE", { 
                  weekday: "long", 
                  day: "numeric", 
                  month: "long" 
                })}
              </Text>
              <div style={{ marginTop: 10 }}>
                {available.map(item => (
                  <Button 
                    key={item.startTime} 
                    icon={<ClockCircleOutlined />} 
                    style={{ margin: "0 10px 10px 0" }} 
                    onClick={() => { 
                      setSlot({ date: day.date, time: item.startTime }); 
                      setModal(true); 
                    }}
                  >
                    {item.startTime.slice(0, 5)}
                  </Button>
                ))}
              </div>
            </div>
          ) : null;
        })
      ) : (
        <Empty description="No hay horarios disponibles en los próximos días" />
      )}
    </Card>
  );

  const nav = (
    <header style={{ 
      position: "sticky", 
      top: 0, 
      zIndex: 10, 
      background: "#fdfdfd", 
      boxShadow: "0 2px 14px #a1acee29" 
    }}>
      <div style={{ 
        maxWidth: 1180, 
        margin: "auto", 
        minHeight: 66, 
        padding: "12px 24px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        flexWrap: "wrap", 
        gap: 12 
      }}>
        <Button 
          type="text" 
          onClick={home} 
          style={{ padding: 0, height: "auto" }}
        >
          <Space>
            <Avatar 
              shape="square" 
              src={clinic.profileImageUrl || undefined} 
              icon={<ShopOutlined />} 
              size={53}
            />
            <Text strong style={{ color: "#fff", fontSize: 16 }}>
              {clinic.displayName}
            </Text>
          </Space>
        </Button>
        
        <Space wrap>
          <Button 
            type="text" 
            style={{ color: "#4b25f1",
              fontSize:"15px",
             }} 
            onClick={() => setView("doctors")}
          >
           <strong> Médicos</strong> 
          </Button>
          
          <Button 
            
            type="text" 
            style={{ color: "#4b25f1",
              fontSize:"15px"
             }} 
            onClick={() => { 
              home(); 
              setTimeout(() => 
                document.getElementById("specialties")?.scrollIntoView({ behavior: "smooth" }), 
                0
              ); 
            }}
          >
            <strong>Especialidades</strong>
          </Button>
          
          <Button 
            type="text" 
            style={{ color: "#4b25f1",
              fontSize:"15px"
             }} 
            onClick={() => message.info("Pronto podrás contactar directamente con la institución.")}
          >
            <strong>Contáctanos</strong>
          </Button>
          
          <Button 
            type="text" 
            style={{ color: "#4b25f1",
              fontSize:"15px"
             }} 
            onClick={() => { 
              home(); 
              setTimeout(() => 
                document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" }), 
                0
              ); 
            }}
          >
            <strong>Blog</strong>
          </Button>
          
          <Button 
            type="primary"
            style={{fontSize:"17px",
              background: appearance.loginButton ?? blue,
              borderColor: appearance.loginButton ?? blue
            }}
            onClick={() => navigate(hasActiveSession ? dashboardPath : "/access")}
          >
           <strong>{hasActiveSession ? "Dashboard" : "Iniciar sesión"}</strong> 
          </Button>
          
          <Button 
            type="primary" 
            style={{fontSize:"17px",
              background: appearance.appointmentButton ?? blue,
              borderColor: appearance.appointmentButton ?? blue
            }}
            icon={<CalendarOutlined />} 
            onClick={() => { 
              setDoctor(undefined); 
              setSpecialty(undefined); 
              setName(""); 
              setView("booking"); 
            }}
          >
            <strong>Agenda tu cita</strong>
          </Button>
        </Space>
      </div>
    </header>
  );
  
  const booking = (
    <div style={{ maxWidth: 970, margin: "18px auto" }}>
      <div style={{ 
        background: blue, 
        borderRadius: "18px 18px 0 0", 
        padding: "30px 28px", 
        color: "#fff", 
        textAlign: "center" 
      }}>
        <Avatar 
          size={66} 
          src={clinic.profileImageUrl || undefined} 
          icon={<ShopOutlined />} 
          style={{ background: "#fff", marginBottom: 10 }} 
        />
        <Title level={2} style={{ color: "#fff", margin: 0 }}>
          Agenda tu cita
        </Title>
        <Text style={{ color: "#eaf5ff", fontSize: 16 }}>
          Staff médico especializado
        </Text>
      </div>
      
      <Card style={{ borderRadius: "0 0 18px 18px" }}>
        <Title level={4}>Elige una especialidad</Title>
        
        <Select 
          allowClear 
          placeholder="Selecciona una especialidad" 
          style={{ width: "100%", maxWidth: 440, marginBottom: 24 }} 
          value={specialty} 
          onChange={value => { 
            setSpecialty(value); 
            setDoctor(undefined); 
          }} 
          options={specialties.map(item => ({ value: item, label: item }))} 
        />
        
        {!specialty ? (
          <Empty description="Selecciona una especialidad para ver los médicos disponibles" />
        ) : !doctor ? (
          <>
            <Input 
              allowClear 
              prefix={<SearchOutlined />} 
              placeholder="Buscar médico por nombre" 
              value={name} 
              onChange={event => setName(event.target.value)} 
              style={{ marginBottom: 20 }} 
            />
            {doctorCards("booking")}
          </>
        ) : (
          schedule
        )}
      </Card>
    </div>
  );
  
  const doctorsPage = (
    <>
      <Title level={2}>Médicos de {clinic.displayName}</Title>
      <Paragraph type="secondary">
        Busca por nombre o especialidad.
      </Paragraph>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 22 }}>
        <Col xs={24} md={10}>
          <Input 
            allowClear 
            prefix={<SearchOutlined />} 
            placeholder="Buscar por nombre" 
            value={name} 
            onChange={event => setName(event.target.value)} 
          />
        </Col>
        
        <Col xs={24} md={8}>
          <Select 
            allowClear 
            placeholder="Filtrar por especialidad" 
            style={{ width: "100%" }} 
            value={specialty} 
            onChange={setSpecialty} 
            options={specialties.map(item => ({ value: item, label: item }))} 
          />
        </Col>
      </Row>
      
      {doctorCards("availability")}
    </>
  );
  
  const homePage = (
    <>
      <section style={{ maxWidth: 850, margin: "58px auto", textAlign: "center" }}>
        <Title level={3} style={{ color: "#164f82", fontSize: 27 }}>
          Un poco sobre nosotros
        </Title>
        
        <Paragraph style={{ color: "#51606e", fontSize: 20, lineHeight: 1.8 }}>
          {clinic.description || 
            `En ${clinic.displayName} trabajamos para brindar atención médica segura, cercana y confiable. Nuestro equipo acompaña a cada paciente desde la prevención hasta su recuperación.`
          }
        </Paragraph>
        
        <Paragraph style={{ color: "#51606e", fontSize: 20, lineHeight: 1.8 }}>
          <strong>Combinamos experiencia médica, orientación clara y herramientas digitales para que puedas conocer especialidades, profesionales y horarios de una forma simple y humana.
       </strong> 
          </Paragraph>
      </section>
      
       <div
  style={{
        background: blue,
    borderRadius: 25,
    padding: "35px 25px",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 40,
    color: "#fff",
    flexWrap: "wrap",
    gap: 0,
    
  }}
>
  <div
    onClick={() => setView("booking")}
    style={{
      cursor: "pointer",
      textAlign: "center",
      transition: "0.3s",
    }}
  >
    <img
      src={citaImage}
      alt="Agendar cita"
      style={{
        width: 150,
        marginBottom: 2,
      }}
    />
    <h3 style={{ color: "#ffffff" }}>AGENDAR UNA CITA</h3>
  </div>

  <div
    onClick={() => setView("doctors")}
    style={{
      cursor: "pointer",
      textAlign: "center",
      transition: "0.3s",
    }}
  >
    <img
      src={horarioImage}
      alt="Horario"
      style={{
        width: 180,
        marginBottom: 2,
      }}
    />
    <h3 style={{ color: "#fff" }}>
      CONSULTA HORARIO DE MÉDICOS
    </h3>
  </div>
</div>
      
      <section style={{ 
        marginTop: 70, 
        background: "#fafafa", 
        padding: "50px 24px" ,
        width: "100vw",
        marginLeft :"calc(50% - 50vw)",
        marginRight :"calc(50% - 50vw)",
        boxSizing: "border-box",
      }}>

        <div 
        style={{maxWidth: 1180,
          margin: "auto",
          padding: "0 24px",
        }}>

        <Title level={1} style={{ color: "#4b25f1" }}>
          <strong>Es mejor agendar online</strong>
        </Title>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 60,
    flexWrap: "wrap",
  }}
>
  {/* Lado izquierdo */}
  <div style={{ flex: 1, minWidth: 320 }}>
    <Text style={{ fontSize: 22 }}>
      El canal online es:
    </Text>

    <div style={{ marginTop: 18 }}>
      <Text style={{ display: "block", fontSize: 20 }}>• Más sencillo</Text>
      <Text style={{ display: "block", fontSize: 20 }}>• Más rápido</Text>
      <Text style={{ display: "block", fontSize: 20 }}>• Más cómodo</Text>
      <Text style={{ display: "block", fontSize: 20 }}>• Más informativo</Text>
    </div>

    <Button
      size="large"
      style={{
        marginTop: 30,
        background: "#FDBA2D",
        borderColor: "#FDBA2D",
        color: "#fff",
        fontWeight: 700,
        width: 150,
      }}
    >
      Contáctanos
    </Button>
  </div>

  {/* Lado derecho */}
  <div style={{ flex: 1, textAlign: "center" }}>
    <motion.img
      src={telefonoImage}
      alt="Agenda Online"
      whileHover={{
        rotate: [0, -10, 10 ,-10, 10, 0],
        transition: {
          duration: 0.5,
        }
      }}
      style={{
        maxWidth: 700,
        width: "100%",
        cursor: "pointer"
      }}
    />
    </div>
   </div>
 </div>
      </section>

      <section
        className={`subscription-section subscription-section--${subscriptionTheme}`}
        aria-labelledby="subscription-title"
        style={subscriptionTheme === "classic" ? { background: subscriptionColor } : undefined}
      >
        <div className="subscription-section__intro">
          <Text className="subscription-section__eyebrow">PARA TU CLINICA</Text>
          <Title id="subscription-title" level={2}>Planes que crecen con tu atencion</Title>
          <Paragraph>
            Centraliza tus citas, equipo y facturación. Los planes de pago se procesan de forma segura
            con Stripe.
          </Paragraph>
        </div>

        <Row gutter={[20, 20]} className="subscription-plans">
          {[
            { code: "STARTER", name: "Esencial", priceLabel: "Gratis", description: "Para consultorios que comienzan a digitalizar su agenda.", features: ["Agenda online", "Gestion de pacientes", "Soporte inicial"], free: true },
            { code: "PROFESSIONAL", name: "Profesional", priceLabel: "S/ 50 al mes", description: "Para clinicas que coordinan un equipo medico en crecimiento.", features: ["Todo lo esencial", "Mas capacidad para el equipo", "Gestion de agenda de clinica"], featured: true },
            { code: "ENTERPRISE", name: "Vip", priceLabel: "S/ 160 al mes", description: "Para operaciones con necesidades de acompanamiento especializado.", features: ["Todo lo profesional", "Configuracion a medida", "Soporte prioritario"] },
          ].map((plan) => (
            <Col xs={24} md={8} key={plan.code}>
              <article className={`subscription-plan${plan.featured ? " subscription-plan--featured" : ""}`}>
                {plan.featured && <span className="subscription-plan__badge">MAS ELEGIDO</span>}
                <Title level={3}>{plan.name}</Title>
                <Paragraph>{plan.description}</Paragraph>
                <div className="subscription-plan__price">{plan.priceLabel}</div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}><CheckCircleOutlined />{feature}</li>
                  ))}
                </ul>
                <Button
                  type={plan.featured ? "primary" : "default"}
                  icon={plan.free ? undefined : <CreditCardOutlined />}
                  onClick={() => !plan.free && goToBilling(plan.code)}
                  disabled={plan.free}
                  block
                >
                  {plan.free ? "Ya tienes la versión gratis" : `Elegir ${plan.name}`}
                </Button>
              </article>
            </Col>
          ))}
        </Row>
      </section>
      
      <section id="specialties" style={{ marginTop: 70 }}>
        <Title level={2} style={{ color: "#164f82" }}>
          Especialidades
        </Title>
        <Text type="secondary">
          Contamos con más de 15 especialidades.
        </Text>
        
        <Row gutter={[18, 18]} style={{ marginTop: 24 }}>
          {specialties.map(item => (
            <Col xs={24} sm={12} lg={8} key={item}>
              <motion.div className="landing-specialty-motion"
              initial={{opacity: 0, y: 60}}
              whileInView={{ opacity: 1, y:0}}
              viewport={{ once:true}}
              transition={{duration: 0.6}}
              >
              <div className="landing-specialty-card clinic-specialty-card">
                <div className="landing-specialty-orb" />
              <Card 
                cover={
                  <img 
                    alt={item} 
                    src={getSpecialtyImage(item)} 
                    style={{ height: 170, objectFit: "cover" }} 
                  />
                }
              >
                <Title level={4}>{item}</Title>
                <Button 
                  onClick={() => { 
                    setActiveSpecialty(item); 
                    setView("specialty"); 
                  }}
                >
                  Más información
                </Button>
              </Card>
              </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </section>
      
      <section id="blog" style={{ marginTop: 70 }}>
        <Title level={2} style={{ color: "#164f82" }}>
          ¿Por qué somos tu mejor opción?
        </Title>
        <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
          Unimos orientación clara, profesionales capacitados y herramientas digitales para que tu experiencia de salud sea más cercana y ordenada. Cada detalle está pensado para que dediques más tiempo a tu bienestar.
        </Paragraph>
      </section>
    </>
  );
  
  const specialtyPage = (
    <section style={{ maxWidth: 800, margin: "20px auto" }}>
      <Title style={{ color: "#164f82" }}>
        {activeSpecialty}
      </Title>
      
      <Paragraph style={{ fontSize: 17, lineHeight: 1.8 }}>
        Esta especialidad se enfoca en la prevención, diagnóstico y tratamiento oportuno. Nuestro equipo te orienta durante el proceso y coordina la atención adecuada según tus necesidades.
      </Paragraph>
      
      <Button type="primary" style={{ background: blue, borderColor: blue }}>
        Contáctanos
      </Button>
    </section>
  );
  
  return (
  <div style={{ background: pageColor, minHeight: "100vh", color: "#263746" }}>
    {nav}
    
    {/* Carrusel a pantalla completa solo en home */}
    {view === "home" && (
      <Carousel arrows autoplay autoplaySpeed={4000} effect="fade" className="clinic-carousel">
        <img 
          alt="Atención médica" 
          src={carouselImages[0]} 
          style={{ 
            width: "100%", 
            height: "500px",
            objectFit: "cover"
          }} 
        />
        <img 
          alt="Atención de la clínica" 
          src={carouselImages[1]} 
          style={{ 
            width: "100%", 
            height: "500px",
            objectFit: "cover"
          }} 
        />
      </Carousel>
    )}
    
      
      <main style={{ maxWidth: 1180, margin: "auto", padding: "30px 24px 70px" }}>
        {view === "doctors" ? (
          doctorsPage
        ) : view === "booking" ? (
          booking
        ) : view === "availability" ? (
          <div style={{ maxWidth: 820, margin: "20px auto" }}>
            <Title level={2}>Disponibilidad del médico</Title>
            {schedule}
          </div>
        ) : view === "specialty" ? (
          specialtyPage
        ) : (
          homePage
        )}
      </main>
      
      <Modal 
        open={modal} 
        title="Disponibilidad del médico" 
        okText="Agendar y pagar" 
        cancelText="Cerrar" 
        onCancel={() => { setCheckoutLoading(false); setModal(false); }} 
        onOk={startAppointmentCheckout}
        confirmLoading={checkoutLoading}
      >
        <Title level={4}>Detalle del horario seleccionado</Title>
        
        <Space direction="vertical">
          <Avatar 
            size={64} 
            src={doctor?.profileImageUrl} 
            icon={<UserOutlined />} 
          />
          
          <Text strong>Médico</Text>
          <Text>{doctor?.displayName}</Text>
          
          <Text strong>Especialidad</Text>
          <Text>{(doctor?.specialties ?? []).join(", ") || doctor?.headline}</Text>
          
          <Text strong>Fecha</Text>
          <Text>{slot?.date}</Text>
          
          <Text strong>Hora</Text>
          <Text>{slot?.time?.slice(0, 5)}</Text>

          <Text strong>Precio de consulta</Text>
          <Text>{doctor?.consultationPrice != null ? `S/ ${Number(doctor.consultationPrice).toFixed(2)}` : "Precio por confirmar"}</Text>
        </Space>
      </Modal>
    </div>
  );
}
