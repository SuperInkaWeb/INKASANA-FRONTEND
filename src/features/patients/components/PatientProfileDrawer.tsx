import { Descriptions, Drawer, Tag } from "antd";
import type { Patient } from "../types/patient.types";

type Props = {
  open: boolean;
  patient?: Patient | null;
  onClose: () => void;
};

export function PatientProfileDrawer({
  open,
  patient,
  onClose,
}: Props) {
  return (
    <Drawer
      title="Perfil del paciente"
      open={open}
      onClose={onClose}
      width={520}
    >
      {patient && (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Nombre">
            {patient.fullName}
          </Descriptions.Item>

          <Descriptions.Item label="Identificación">
            {patient.identification || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Fecha de nacimiento">
            {patient.birthDate || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Género">
            {patient.gender || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Teléfono">
            {patient.phone || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Correo">
            {patient.email || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Dirección">
            {patient.address || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Estado">
            <Tag color={patient.status === "ACTIVE" ? "green" : "red"}>
              {patient.status}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Contacto emergencia">
            {patient.emergencyContactName || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Teléfono emergencia">
            {patient.emergencyContactPhone || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Notas">
            {patient.notes || "-"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}