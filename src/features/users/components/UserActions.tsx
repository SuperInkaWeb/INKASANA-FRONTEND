import { Button, Popconfirm, Space } from "antd";
import type { TenantUser } from "../types/user.types";

type Props = {
  user: TenantUser;
  loading?: boolean;
  onEdit: (user: TenantUser) => void;
  onActivate: (id: string) => void;
  onSuspend: (id: string) => void;
  onDeactivate: (id: string) => void;
};

export function UserActions({
  user,
  loading = false,
  onEdit,
  onActivate,
  onSuspend,
  onDeactivate,
}: Props) {
  const isOwner = user.role === "OWNER";

  return (
    <Space wrap>
      <Button size="small" onClick={() => onEdit(user)}>
        Editar
      </Button>

      {user.status !== "ACTIVE" && (
        <Popconfirm
          title="¿Activar usuario?"
          description="El usuario podrá volver a acceder al sistema."
          okText="Activar"
          cancelText="Cancelar"
          onConfirm={() => onActivate(user.id)}
        >
          <Button size="small" type="primary" loading={loading}>
            Activar
          </Button>
        </Popconfirm>
      )}

      {user.status === "ACTIVE" && !isOwner && (
        <Popconfirm
          title="¿Suspender usuario?"
          description="El usuario no podrá acceder temporalmente."
          okText="Suspender"
          cancelText="Cancelar"
          onConfirm={() => onSuspend(user.id)}
        >
          <Button size="small" danger loading={loading}>
            Suspender
          </Button>
        </Popconfirm>
      )}

      {user.status !== "INACTIVE" && !isOwner && (
        <Popconfirm
          title="¿Desactivar usuario?"
          description="El usuario quedará inactivo en la organización."
          okText="Desactivar"
          cancelText="Cancelar"
          onConfirm={() => onDeactivate(user.id)}
        >
          <Button size="small" danger type="link" loading={loading}>
            Desactivar
          </Button>
        </Popconfirm>
      )}
    </Space>
  );
}