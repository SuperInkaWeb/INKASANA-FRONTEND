import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { brandingService } from "../services/branding.service";

const { Title, Text } = Typography;

export function BrandingPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBranding = async () => {
    try {
      setLoading(true);
      const branding = await brandingService.getBranding();
      form.setFieldsValue(branding);
    } catch (error) {
      console.error("Error cargando branding:", error);
      message.error("No se pudo cargar el branding");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);

      await brandingService.saveBranding({
        ...values,
        onboardingCompleted: true,
      });

      message.success("Branding guardado correctamente");
      loadBranding();
    } catch (error) {
      console.error("Error guardando branding:", error);
      message.error("No se pudo guardar el branding");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadBranding();
  }, []);

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={3}>Branding de la clínica</Title>
          <Text type="secondary">
            Configura la identidad visual y datos principales del tenant.
          </Text>
        </div>

        <Card loading={loading}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
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
                  <Input placeholder="Cuidamos tu salud con tecnología" />
                </Form.Item>
              </Col>

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

              <Col xs={24} md={12}>
                <Form.Item label="Email de contacto" name="contactEmail">
                  <Input placeholder="contacto@clinica.com" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Teléfono de contacto" name="contactPhone">
                  <Input placeholder="0999999999" />
                </Form.Item>
              </Col>

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
                  <Input placeholder="Av. Principal y Calle Secundaria" />
                </Form.Item>
              </Col>
            </Row>

            <Button type="primary" htmlType="submit" loading={saving}>
              Guardar branding
            </Button>
          </Form>
        </Card>
      </Space>
    </div>
  );
}