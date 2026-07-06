import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";

import type {
  CreateTenantUserRequest,
  TenantUser,
  TenantUserRole,
} from "../types/user.types";

type Props = {
  open: boolean;
  loading?: boolean;
  user?: TenantUser | null;
  onCancel: () => void;
  onSubmit: (values: CreateTenantUserRequest) => void;
};

const ROLE_OPTIONS: Array<{ value: TenantUserRole; label: string }> = [
  { value: "ADMIN", label: "Administrador" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "THERAPIST", label: "Terapeuta" },
  { value: "RECEPTIONIST", label: "Recepcionista" },
];

const OWNER_ROLE_OPTION: Array<{ value: TenantUserRole; label: string }> = [
  { value: "OWNER", label: "Propietario" },
];

export function UserFormModal({
  open,
  loading = false,
  user,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<CreateTenantUserRequest>();

  const isEditing = !!user;
  const isOwnerUser = user?.role === "OWNER";

  const roleOptions: Array<{ value: TenantUserRole; label: string }> =
    isOwnerUser ? OWNER_ROLE_OPTION : ROLE_OPTIONS;

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        auth0Id: user.auth0Id ?? null,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone ?? null,
        role: user.role,
      });
      return;
    }

    if (open && !user) {
      form.resetFields();
    }
  }, [open, user, form]);

  return (
    <Modal
      open={open}
      title={isEditing ? "Editar usuario" : "Crear usuario"}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      okText={isEditing ? "Guardar cambios" : "Crear usuario"}
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit({
            ...values,
            auth0Id: values.auth0Id ?? null,
            phone: values.phone?.trim() || null,
          });
        }}
      >
        <Form.Item
          label="Nombre completo"
          name="fullName"
          rules={[
            { required: true, message: "Ingrese el nombre completo" },
            { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
          ]}
        >
          <Input placeholder="Ej: Alexis Narea" />
        </Form.Item>

        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[
            { required: true, message: "Ingrese el correo" },
            { type: "email", message: "Correo inválido" },
          ]}
        >
          <Input placeholder="usuario@clinica.com" disabled={isEditing} />
        </Form.Item>

        <Form.Item label="Teléfono" name="phone">
          <Input placeholder="Ej: 0999999999" />
        </Form.Item>

        <Form.Item
          label="Rol"
          name="role"
          rules={[{ required: true, message: "Seleccione un rol" }]}
        >
          <Select
            options={roleOptions}
            disabled={isOwnerUser}
            placeholder="Seleccione un rol"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}