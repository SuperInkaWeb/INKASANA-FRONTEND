import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Typography,
  message,
  Result,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createOrganization,
  type OrganizationResponse,
} from "../api/organization-register.api";

const { Title, Text } = Typography;

export function RegisterOrganizationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [createdOrg, setCreatedOrg] = useState<OrganizationResponse | null>(
    null
  );

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const organization = await createOrganization({
        name: values.name,
        type: values.type,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        country: values.country,
      });

      setCreatedOrg(organization);
      message.success("Organización registrada correctamente");
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message || "No se pudo registrar la organización";

      message.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  if (createdOrg) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f5f7fb",
          padding: 24,
        }}
      >
        <Card style={{ width: 520 }}>
          <Result
            status="success"
            title="Organización creada"
            subTitle={`Tu slug de acceso es: ${createdOrg.slug}`}
            extra={[
              <Button
                type="primary"
                key="login"
                onClick={() => navigate(`/login?slug=${createdOrg.slug}`)}
              >
                Ir al login
              </Button>,
            ]}
          />

          <Text strong>Nombre:</Text>
          <br />
          <Text>{createdOrg.name}</Text>

          <br />
          <br />

          <Text strong>Schema:</Text>
          <br />
          <Text>{createdOrg.schemaName}</Text>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f7fb",
        padding: 24,
      }}
    >
      <Card style={{ width: 520 }}>
        <Title level={3}>Registrar clínica u hospital</Title>
        <Text type="secondary">
          Crea una organización para generar su tenant y acceder al sistema.
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
          initialValues={{
            type: "CLINIC",
            country: "Ecuador",
          }}
        >
          <Form.Item
            label="Nombre de la organización"
            name="name"
            rules={[
              { required: true, message: "Ingresa el nombre" },
              { min: 3, message: "Mínimo 3 caracteres" },
            ]}
          >
            <Input placeholder="Ej: Clínica Día 30" />
          </Form.Item>

          <Form.Item
            label="Tipo"
            name="type"
            rules={[{ required: true, message: "Selecciona el tipo" }]}
          >
            <Select
              options={[
                { value: "CLINIC", label: "Clínica" },
                { value: "HOSPITAL", label: "Hospital" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Correo del OWNER"
            name="email"
            rules={[
              { required: true, message: "Ingresa el correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input placeholder="owner@clinica.com" />
          </Form.Item>

          <Form.Item label="Teléfono" name="phone">
            <Input placeholder="0999999999" />
          </Form.Item>

          <Form.Item label="Dirección" name="address">
            <Input placeholder="Dirección de la clínica" />
          </Form.Item>

          <Form.Item label="Ciudad" name="city">
            <Input placeholder="Cuenca" />
          </Form.Item>

          <Form.Item label="País" name="country">
            <Input placeholder="Ecuador" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Registrar organización
          </Button>

          <Button
            type="link"
            block
            onClick={() => navigate("/login")}
            style={{ marginTop: 8 }}
          >
            Ya tengo una organización
          </Button>
        </Form>
      </Card>
    </div>
  );
}