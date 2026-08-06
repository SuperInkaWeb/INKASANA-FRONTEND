import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import { InboxOutlined, PictureOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import {
  clinicProfileService,
  type MarketplaceOrganizationProfile,
} from "../services/clinic-profile.service";

const { Title, Text } = Typography;
const { TextArea } = Input;

export function ClinicMarketplaceProfilePage() {
  const [form] = Form.useForm();
  const [visualEditing, setVisualEditing] = useState(false);
  const [appearanceTarget, setAppearanceTarget] = useState("pageBackground");
  const [subscriptionTheme, setSubscriptionTheme] = useState("classic");
  const [appearance, setAppearance] = useState<Record<string, string>>({
    pageBackground: "#ffffff", loginButton: "#4b25f1", appointmentButton: "#4b25f1",
    bookingButton: "#0868b8", scheduleButton: "#0868b8", subscriptions: "#2438b9",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<MarketplaceOrganizationProfile | null>(
    null
  );
  const [notFound, setNotFound] = useState(false);

  const uploadImage = async (
    imageType: "profile" | "cover" | "carousel-1" | "carousel-2",
    file: File
  ) => {
    try {
      const updated = await clinicProfileService.uploadMyClinicImage(imageType, file);
      setProfile(updated);
      form.setFieldsValue(updated);
      message.success("Imagen actualizada correctamente");
    } catch (error) {
      console.error("Error subiendo imagen de clínica:", error);
      message.error("No se pudo subir la imagen. Inténtalo nuevamente.");
    }
    return false;
  };

  const imageUploadProps = (
    imageType: "profile" | "cover" | "carousel-1" | "carousel-2"
  ): UploadProps => ({
    accept: "image/jpeg,image/png,image/webp",
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => uploadImage(imageType, file),
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      const data = await clinicProfileService.getMyClinicProfile();
      setProfile(data);
      form.setFieldsValue(data);
      setAppearance((current) => ({
        ...current,
        pageBackground: data.pageColor || current.pageBackground,
        bookingButton: data.buttonColor || current.bookingButton,
        scheduleButton: data.buttonColor || current.scheduleButton,
        subscriptions: data.subscriptionColor || current.subscriptions,
      }));
      if (data.appearanceConfig) {
        try {
          const savedAppearance = JSON.parse(data.appearanceConfig!);
          setAppearance((current) => ({ ...current, ...savedAppearance }));
          setSubscriptionTheme(savedAppearance.subscriptionTheme || "classic");
        } catch { /* configuración antigua */ }
      }
    } catch (error) {
      console.error("Error cargando perfil de marketplace:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      const updated = await clinicProfileService.updateMyClinicProfile({
        ...values,
        appearanceConfig: JSON.stringify({ ...appearance, subscriptionTheme }),
      });
      setProfile(updated);
      message.success("Descripción de la clínica guardada correctamente");
    } catch (error) {
      console.error("Error guardando perfil de marketplace:", error);
      message.error("No se pudo guardar la información de la clínica");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={3}>Perfil público en el Marketplace</Title>
          <Text type="secondary">
            Esta información es la que ven los pacientes cuando entran a tu
            clínica u hospital dentro del marketplace público, en la sección
            "Sobre la clínica".
          </Text>
        </div>

        {notFound && !loading && (
          <Alert
            type="warning"
            showIcon
            message="Todavía no tienes un perfil de marketplace"
            description="Tu organización debe estar activa y aprobada para poder editar su información pública. Si ya fue aprobada y sigues viendo este mensaje, contáctanos."
          />
        )}

        {!notFound && (
          <Card loading={loading}>
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              <Row gutter={[24, 24]} style={{ marginBottom: 40 }} align="top">
                <Col xs={24} md={10}>
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Text strong>Ícono y foto de perfil</Text>
                    <Space align="center" style={{ display: "flex", marginTop: 12, marginBottom: 12 }}>
                      <Avatar size={72} src={profile?.profileImageUrl || undefined} icon={<PictureOutlined />} />
                      <Text type="secondary">Arrastra una imagen o haz clic para elegirla.</Text>
                    </Space>
                    <Upload.Dragger
                      {...imageUploadProps("profile")}
                      style={{ minHeight: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {profile?.profileImageUrl ? (
                        <img
                          src={profile.profileImageUrl}
                          alt="Foto de perfil de la clínica"
                          style={{ maxHeight: 140, maxWidth: "100%", objectFit: "contain", borderRadius: 8 }}
                        />
                      ) : (
                        <>
                          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                          <p className="ant-upload-text">Suelta aquí la foto de perfil</p>
                          <p className="ant-upload-hint">JPG, PNG o WEBP. Máximo 5 MB.</p>
                        </>
                      )}
                    </Upload.Dragger>
                  </div>
                </Col>
                <Col xs={24} md={14}>
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Text strong>Foto de portada</Text>
                    <div style={{ height: 12 }} />
                    <Upload.Dragger
                      {...imageUploadProps("cover")}
                      style={{ minHeight: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {profile?.coverImageUrl ? (
                        <img
                          src={profile.coverImageUrl}
                          alt="Portada de la clínica"
                          style={{ maxHeight: 150, maxWidth: "100%", objectFit: "cover", borderRadius: 8 }}
                        />
                      ) : (
                        <>
                          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                          <p className="ant-upload-text">Suelta aquí la foto de portada</p>
                          <p className="ant-upload-hint">JPG, PNG o WEBP. Máximo 5 MB.</p>
                        </>
                      )}
                    </Upload.Dragger>
                  </div>
                </Col>
              </Row>
              <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                {([
                  ["carousel-1", "Imagen de transición 1", profile?.carouselImageUrl1],
                  ["carousel-2", "Imagen de transición 2", profile?.carouselImageUrl2],
                ] as const).map(([imageType, label, imageUrl]) => (
                  <Col xs={24} md={12} key={imageType}>
                    <Text strong>{label}</Text>
                    <Upload.Dragger
                      {...imageUploadProps(imageType)}
                      style={{ minHeight: 160, marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={label} style={{ maxHeight: 130, maxWidth: "100%", objectFit: "cover", borderRadius: 8 }} />
                      ) : (
                        <>
                          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                          <p className="ant-upload-text">Suelta aquí la imagen del carrusel</p>
                          <p className="ant-upload-hint">JPG, PNG o WEBP. Máximo 5 MB.</p>
                        </>
                      )}
                    </Upload.Dragger>
                  </Col>
                ))}
              </Row>
              <Card
                size="small"
                title={visualEditing ? "Modo de edición visual" : "Vista previa de tu marketplace"}
                style={{ marginBottom: 32 }}
                extra={<Button onClick={() => setVisualEditing((value) => !value)}>{visualEditing ? "Salir del modo edición" : "Editar visualmente"}</Button>}
              >
                <Text type="secondary">{visualEditing ? "Haz clic en cualquier elemento coloreado y elige su color. Esto es un borrador hasta guardar." : "Así se ve actualmente tu portada. Activa Editar visualmente para modificarla."}</Text>
                <div style={{ maxWidth: 680, margin: "14px auto 0", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", fontSize: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#fff" }}>
                    <strong>{profile?.displayName || "Tu clínica"}</strong>
                    <Space size={6}>
                      <Button size="small" onClick={() => visualEditing && setAppearanceTarget("loginButton")} style={{ background: appearance.loginButton, borderColor: appearance.loginButton, color: "#fff" }}>Iniciar sesión</Button>
                      <Button size="small" onClick={() => visualEditing && setAppearanceTarget("appointmentButton")} style={{ background: appearance.appointmentButton, borderColor: appearance.appointmentButton, color: "#fff" }}>Agenda tu cita</Button>
                    </Space>
                  </div>
                  <div style={{ height: 110, background: profile?.coverImageUrl ? `center / cover url(${profile.coverImageUrl})` : "linear-gradient(120deg, #e0f2fe, #dbeafe)", display: "flex", alignItems: "end", padding: 14 }}>
                    <div style={{ background: "rgb(255 255 255 / 88%)", padding: "6px 10px", borderRadius: 6 }}><strong>{profile?.headline || "Tu salud, nuestra prioridad"}</strong></div>
                  </div>
                  <div
                    onClick={() => visualEditing && setAppearanceTarget("pageBackground")}
                    style={{ background: appearance.pageBackground, minHeight: 150, padding: 20, cursor: visualEditing ? "pointer" : "default" }}
                  >
                    <Text strong>Portada y contenido de tu marketplace</Text>
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <div style={{ flex: 1, padding: 10, background: "#fff", borderRadius: 6 }}>Especialidades</div>
                      <div style={{ flex: 1, padding: 10, background: "#fff", borderRadius: 6 }}>Equipo médico</div>
                      <div style={{ flex: 1, padding: 10, background: "#fff", borderRadius: 6 }}>Agenda online</div>
                    </div>
                    <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <Button
                        onClick={(event) => { event.stopPropagation(); if (visualEditing) setAppearanceTarget("bookingButton"); }}
                        style={{ background: appearance.bookingButton, borderColor: appearance.bookingButton, color: "#fff" }}
                      >
                        Agendar cita
                      </Button>
                      <Button
                        onClick={(event) => { event.stopPropagation(); if (visualEditing) setAppearanceTarget("scheduleButton"); }}
                        style={{ background: appearance.scheduleButton, borderColor: appearance.scheduleButton, color: "#fff" }}
                      >
                        Ver horarios
                      </Button>
                    </div>
                  </div>
                  <div
                    onClick={() => visualEditing && setAppearanceTarget("subscriptions")}
                    style={{ background: appearance.subscriptions, color: "#fff", padding: 18, cursor: visualEditing ? "pointer" : "default" }}
                  >
                    <Text style={{ color: "#fff" }} strong>Planes y suscripciones</Text>
                    <div style={{ marginTop: 8, fontSize: 13 }}>Esta zona cambia sin alterar los botones de la página.</div>
                  </div>
                </div>
                {visualEditing && <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}><Text strong>Color seleccionado</Text><Input type="color" value={appearance[appearanceTarget]} onChange={(event) => setAppearance((current) => ({ ...current, [appearanceTarget]: event.target.value }))} style={{ width: 54, height: 36, padding: 3 }} /></div>}
              </Card>
              <Card size="small" title="Estilo de suscripciones" style={{ marginBottom: 32 }}>
                <Text type="secondary">
                  Este estilo solo cambia la sección de planes y suscripciones de tu página pública.
                </Text>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  {[
                    { id: "classic", name: "Claro", description: "Diseño blanco y azul actual" },
                    { id: "graphite", name: "Grafito", description: "Negro elegante con detalles claros" },
                    { id: "metallic-blue", name: "Azul metálico", description: "Azul profundo con acentos turquesa" },
                  ].map((theme) => (
                    <Col xs={24} md={8} key={theme.id}>
                      <button
                        type="button"
                        className={`subscription-theme-option subscription-theme-option--${theme.id}${subscriptionTheme === theme.id ? " subscription-theme-option--selected" : ""}`}
                        onClick={() => setSubscriptionTheme(theme.id)}
                        aria-pressed={subscriptionTheme === theme.id}
                      >
                        <span className="subscription-theme-option__preview"><span /><span /><span /></span>
                        <strong>{theme.name}</strong>
                        <small>{theme.description}</small>
                      </button>
                    </Col>
                  ))}
                </Row>
              </Card>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Nombre público" name="displayName">
                    <Input placeholder="Clínica Salud Integral" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Titular / Frase corta"
                    name="headline"
                    tooltip="Una frase breve que aparece junto al nombre de la clínica"
                  >
                    <Input placeholder="Cuidamos tu salud con tecnología" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Descripción de la clínica"
                    name="description"
                    tooltip="Cuenta cuándo se fundó, su misión, especialidades, o lo que quieras que vean los pacientes"
                  >
                    <TextArea
                      rows={6}
                      placeholder="Nuestra clínica se especializa en..."
                      maxLength={2000}
                      showCount
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Ciudad" name="city">
                    <Input placeholder="Lima" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="País" name="country">
                    <Input placeholder="Perú" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item label="Dirección" name="address">
                    <Input placeholder="Av. Principal 123" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Teléfono" name="phone">
                    <Input placeholder="999999999" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Email de contacto" name="email">
                    <Input placeholder="contacto@clinica.com" />
                  </Form.Item>
                </Col>

              </Row>

              <Button type="primary" htmlType="submit" loading={saving}>
                Guardar información
              </Button>

              {profile && !profile.isPublished && (
                <Alert
                  style={{ marginTop: 16 }}
                  type="info"
                  showIcon
                  message="Tu perfil aún no está publicado en el marketplace público"
                />
              )}
            </Form>
          </Card>
        )}
      </Space>
    </div>
  );
}
