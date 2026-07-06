import { Button, Card, Form, Input, Result, Select, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrganization } from "../api/organization.api";
import type {
  CreateOrganizationRequest,
  OrganizationResponse,
} from "../types/organization.types";

const normalizeSlug = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export function OrganizationRegisterForm() {
  const [loading, setLoading] = useState(false);
  const [createdOrganization, setCreatedOrganization] =
    useState<OrganizationResponse | null>(null);

  const [form] = Form.useForm<CreateOrganizationRequest>();
  const navigate = useNavigate();

  const handleFinish = async (values: CreateOrganizationRequest) => {
    try {
      setLoading(true);

      const payload: CreateOrganizationRequest = {
        ...values,
        slug: normalizeSlug(values.slug),
      };

      const organization = await createOrganization(payload);

      setCreatedOrganization(organization);

      message.success(
        `Organización creada: ${organization.name} | Schema: ${organization.schemaName}`
      );

      form.resetFields();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "No se pudo crear la organización"
      );
    } finally {
      setLoading(false);
    }
  };

  if (createdOrganization) {
    return (
      <Result
        status="success"
        title="Organización creada correctamente"
        subTitle={`La organización ${createdOrganization.name} fue creada con el schema ${createdOrganization.schemaName}. Slug: ${createdOrganization.slug}`}
        extra={[
          <Button
            type="primary"
            key="login"
            onClick={() => navigate(`/login?slug=${createdOrganization.slug}`)}
          >
            Ir al login
          </Button>,
          <Button key="new" onClick={() => setCreatedOrganization(null)}>
            Crear otra organización
          </Button>,
        ]}
      />
    );
  }

  return (
    <Card title="Registrar clínica u hospital">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
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
            { min: 3, message: "El nombre debe tener mínimo 3 caracteres" },
          ]}
        >
          <Input placeholder="Ej: Clínica Demo Cuenca" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          normalize={normalizeSlug}
          rules={[
            { required: true, message: "Ingresa el slug" },
            { min: 3, message: "El slug debe tener mínimo 3 caracteres" },
          ]}
        >
          <Input placeholder="clinica-demo-cuenca" />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="type"
          rules={[{ required: true, message: "Selecciona el tipo" }]}
        >
          <Select
            options={[
              { label: "Clínica", value: "CLINIC" },
              { label: "Hospital", value: "HOSPITAL" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Correo institucional"
          name="email"
          rules={[{ type: "email", message: "Correo institucional inválido" }]}
        >
          <Input placeholder="admin@clinica.com" />
        </Form.Item>

        <Form.Item label="Teléfono" name="phone">
          <Input placeholder="0999999999" />
        </Form.Item>

        <Form.Item label="Dirección" name="address">
          <Input placeholder="Av. Principal" />
        </Form.Item>

        <Form.Item label="Ciudad" name="city">
          <Input placeholder="Cuenca" />
        </Form.Item>

        <Form.Item label="País" name="country">
          <Input placeholder="Ecuador" />
        </Form.Item>

        <Form.Item
          label="Correo del OWNER"
          name="ownerEmail"
          rules={[
            { required: true, message: "Ingresa el correo del OWNER" },
            { type: "email", message: "Correo del OWNER inválido" },
          ]}
        >
          <Input placeholder="owner@clinica.com" />
        </Form.Item>

        <Form.Item
          label="Nombre completo del OWNER"
          name="ownerFullName"
          rules={[
            { required: true, message: "Ingresa el nombre del OWNER" },
            {
              min: 3,
              message: "El nombre del OWNER debe tener mínimo 3 caracteres",
            },
          ]}
        >
          <Input placeholder="Owner Clínica Demo" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Crear organización
        </Button>
      </Form>
    </Card>
  );
}