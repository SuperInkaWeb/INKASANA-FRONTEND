import { Form, Input, Modal } from "antd";
import { useEffect } from "react";
import type {
  CreateGlobalSpecialtyRequest,
  GlobalSpecialty,
} from "../types/specialty.types";

const { TextArea } = Input;

type Props = {
  open: boolean;
  loading?: boolean;
  specialty?: GlobalSpecialty | null;
  onCancel: () => void;
  onSubmit: (values: CreateGlobalSpecialtyRequest) => void;
};

export function SpecialtyFormModal({
  open,
  loading,
  specialty,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<CreateGlobalSpecialtyRequest>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: specialty?.name ?? "",
        description: specialty?.description ?? "",
      });
    } else {
      form.resetFields();
    }
  }, [open, specialty, form]);

  return (
    <Modal
      open={open}
      title={specialty ? "Editar especialidad" : "Nueva especialidad"}
      okText={specialty ? "Guardar cambios" : "Crear especialidad"}
      cancelText="Cancelar"
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "El nombre es obligatorio" }]}
        >
          <Input placeholder="Ej: Cardiología" maxLength={120} />
        </Form.Item>

        <Form.Item label="Descripción" name="description">
          <TextArea
            rows={4}
            placeholder="Describe brevemente la especialidad"
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}