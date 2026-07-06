import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Steps,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { brandingService } from "../../branding/services/branding.service";
import { onboardingService } from "../services/onboarding.service";

const { Title, Text } = Typography;

export function OnboardingPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const branding = await brandingService.getBranding();
        form.setFieldsValue(branding);
      } catch (error) {
        console.error("Error cargando onboarding:", error);
        message.error("No se pudo cargar el onboarding");
      }
    };

    loadBranding();
  }, [form]);

  const next = async () => {
    try {
      if (current === 0) {
        await form.validateFields(["clinicName"]);
      }

      setCurrent((prev) => prev + 1);
    } catch {
      message.warning("Completa los campos requeridos");
    }
  };

  const prev = () => {
    setCurrent((prev) => prev - 1);
  };

  const finish = async () => {
    try {
      setLoading(true);

      const values = form.getFieldsValue(true);

      console.log("ONBOARDING VALUES", values);

      if (!values.clinicName) {
        message.warning("El nombre de la clínica es obligatorio");
        setCurrent(0);
        return;
      }

      await onboardingService.completeOnboarding({
        clinicName: values.clinicName,
        slogan: values.slogan,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        city: values.city,
        country: values.country,
        address: values.address,
        primaryColor: values.primaryColor || "#1677ff",
        secondaryColor: values.secondaryColor || "#001529",
        logoUrl: values.logoUrl,
        faviconUrl: values.faviconUrl,
      });

      message.success("Onboarding completado correctamente");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error finalizando onboarding:", error);
      message.error("No se pudo finalizar el onboarding");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Clínica",
      content: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nombre de la clínica"
              name="clinicName"
              rules={[
                {
                  required: true,
                  message: "Ingresa el nombre de la clínica",
                },
              ]}
            >
              <Input placeholder="Clínica Salud Integral Cuenca" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Slogan" name="slogan">
              <Input placeholder="Tu salud, nuestra prioridad" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Email de contacto" name="contactEmail">
              <Input placeholder="contacto@saludintegral.com" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Teléfono" name="contactPhone">
              <Input placeholder="0999999999" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: "Ubicación",
      content: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Ciudad" name="city">
              <Input placeholder="Cuenca" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="País" name="country">
              <Input placeholder="Ecuador" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Dirección" name="address">
              <Input placeholder="Av. Remigio Crespo y Solano" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: "Branding",
      content: (
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Color primario" name="primaryColor">
              <Input placeholder="#1677ff" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="Color secundario" name="secondaryColor">
              <Input placeholder="#001529" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="URL del logo" name="logoUrl">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item label="URL del favicon" name="faviconUrl">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      title: "Finalizar",
      content: (
        <div style={{ textAlign: "center", padding: 32 }}>
          <Title level={4}>Todo listo</Title>
          <Text type="secondary">
            Al finalizar, se guardará la configuración inicial del tenant.
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={3}>Configuración inicial</Title>
          <Text type="secondary">
            Completa la información base de tu clínica para comenzar.
          </Text>
        </div>

        <Card>
          <Steps
            current={current}
            items={steps.map((step) => ({
              title: step.title,
            }))}
          />

          <div style={{ marginTop: 32 }}>
            <Form form={form} layout="vertical" preserve>
              {steps[current].content}
            </Form>
          </div>

          <Space style={{ marginTop: 24 }}>
            {current > 0 && <Button onClick={prev}>Anterior</Button>}

            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Siguiente
              </Button>
            )}

            {current === steps.length - 1 && (
              <Button type="primary" loading={loading} onClick={finish}>
                Finalizar onboarding
              </Button>
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
}