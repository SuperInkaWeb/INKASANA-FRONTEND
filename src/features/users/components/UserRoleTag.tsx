import { Tag } from "antd";
import type { TenantUserRole } from "../types/user.types";

type Props = {
  role: TenantUserRole;
};

export function UserRoleTag({ role }: Props) {
  const labels: Record<TenantUserRole, string> = {
    OWNER: "Propietario",
    ADMIN: "Administrador",
    DOCTOR: "Doctor",
    THERAPIST: "Terapeuta",
    RECEPTIONIST: "Recepcionista",
    PATIENT: "Paciente",
  };

  return <Tag>{labels[role]}</Tag>;
}