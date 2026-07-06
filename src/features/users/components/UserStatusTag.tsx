import { Tag } from "antd";
import type { TenantUserStatus } from "../types/user.types";

type Props = {
  status: TenantUserStatus;
};

export function UserStatusTag({ status }: Props) {
  const config = {
    ACTIVE: {
      color: "green",
      label: "Activo",
    },
    INACTIVE: {
      color: "default",
      label: "Inactivo",
    },
    SUSPENDED: {
      color: "red",
      label: "Suspendido",
    },
  } satisfies Record<TenantUserStatus, { color: string; label: string }>;

  return <Tag color={config[status].color}>{config[status].label}</Tag>;
}