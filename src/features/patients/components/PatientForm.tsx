import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

import type {
  CreatePatientRequest,
  Patient,
} from "../types/patient.types";

type Props = {
  open: boolean;
  patient?: Patient | null;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: CreatePatientRequest) => void;
};

export function PatientForm({
  open,
  patient,
  loading,
  onCancel,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && patient) {
      form.setFieldsValue({
        ...patient,
        birthDate: patient.birthDate
          ? dayjs(patient.birthDate)
          : undefined,
      });
    }

    if (open && !patient) {
      form.resetFields();
    }
  }, [open, patient, form]);

  return (
    <Modal
      title={
        patient
          ? "Editar paciente"
          : "Nuevo paciente"
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit({
            ...values,
            birthDate: values.birthDate
              ? values.birthDate.format("YYYY-MM-DD")
              : undefined,
          });
        }}
      >
        <Form.Item
          name="fullName"
          label="Nombre completo"
          rules={[
            {
              required: true,
              message: "Ingrese el nombre",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="identification"
          label="Identificación"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="birthDate"
          label="Fecha de nacimiento"
        >
          <DatePicker
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Género"
        >
          <Select
            allowClear
            options={[
              {
                value: "MALE",
                label: "Masculino",
              },
              {
                value: "FEMALE",
                label: "Femenino",
              },
              {
                value: "OTHER",
                label: "Otro",
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Teléfono"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Dirección"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="emergencyContactName"
          label="Contacto de emergencia"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="emergencyContactPhone"
          label="Teléfono emergencia"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notas"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
        >
          Guardar
        </Button>
      </Form>
    </Modal>
  );
}