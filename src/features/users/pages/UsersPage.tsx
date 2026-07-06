import { useState } from "react";
import {
  Button,
  Card,
  Input,
  message,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import { UserActions } from "../components/UserActions";
import { UserFormModal } from "../components/UserFormModal";
import { UserRoleTag } from "../components/UserRoleTag";
import { UserStatusTag } from "../components/UserStatusTag";
import {
  useActivateUser,
  useCreateUser,
  useDeactivateUser,
  useSuspendUser,
  useUpdateUser,
  useUsers,
} from "../hooks/useUsers";
import type {
  CreateTenantUserRequest,
  TenantUser,
  TenantUserFilters,
  TenantUserRole,
  TenantUserStatus,
} from "../types/user.types";

const { Title, Text } = Typography;

const USER_ROLE_OPTIONS = [
  { value: "OWNER", label: "Propietario" },
  { value: "ADMIN", label: "Administrador" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "THERAPIST", label: "Terapeuta" },
  { value: "RECEPTIONIST", label: "Recepcionista" },
] satisfies Array<{
  value: Exclude<TenantUserRole, "PATIENT">;
  label: string;
}>;

export function UsersPage() {
  const [filters, setFilters] = useState<TenantUserFilters>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TenantUser | null>(null);

  const usersQuery = useUsers(filters);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const activateUserMutation = useActivateUser();
  const suspendUserMutation = useSuspendUser();
  const deactivateUserMutation = useDeactivateUser();

  const visibleUsers =
    usersQuery.data?.filter((user) => user.role !== "PATIENT") ?? [];

  const loadingAction =
    createUserMutation.isPending ||
    updateUserMutation.isPending ||
    activateUserMutation.isPending ||
    suspendUserMutation.isPending ||
    deactivateUserMutation.isPending;

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user: TenantUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (values: CreateTenantUserRequest) => {
    try {
      if (selectedUser) {
        await updateUserMutation.mutateAsync({
          id: selectedUser.id,
          payload: {
            fullName: values.fullName,
            phone: values.phone,
            role: values.role,
            profileImageUrl: selectedUser.profileImageUrl ?? null,
          },
        });

        message.success("Usuario actualizado correctamente");
      } else {
        await createUserMutation.mutateAsync(values);
        message.success("Usuario creado correctamente");
      }

      handleCloseModal();
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "No se pudo guardar el usuario"
      );
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateUserMutation.mutateAsync(id);
      message.success("Usuario activado correctamente");
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "No se pudo activar el usuario"
      );
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendUserMutation.mutateAsync(id);
      message.success("Usuario suspendido correctamente");
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "No se pudo suspender el usuario"
      );
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateUserMutation.mutateAsync(id);
      message.success("Usuario desactivado correctamente");
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "No se pudo desactivar el usuario"
      );
    }
  };

  const columns: ColumnsType<TenantUser> = [
    {
      title: "Nombre",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.fullName}</Text>
          <Text type="secondary">{record.email}</Text>
        </Space>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role: TenantUserRole) => <UserRoleTag role={role} />,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: TenantUserStatus) => <UserStatusTag status={status} />,
    },
    {
      title: "Teléfono",
      dataIndex: "phone",
      key: "phone",
      render: (phone?: string | null) => phone || "—",
    },
    {
      title: "Último login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin?: string | null) =>
        lastLogin ? new Date(lastLogin).toLocaleString() : "—",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <UserActions
          user={record}
          loading={loadingAction}
          onEdit={handleOpenEdit}
          onActivate={handleActivate}
          onSuspend={handleSuspend}
          onDeactivate={handleDeactivate}
        />
      ),
    },
  ];

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space
          align="center"
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
          wrap
        >
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>
              Usuarios
            </Title>
            <Text type="secondary">
              Administra los usuarios internos que acceden al sistema.
            </Text>
          </div>

          <Button type="primary" onClick={handleOpenCreate}>
            Nuevo usuario
          </Button>
        </Space>

        <Space wrap>
          <Input.Search
            allowClear
            placeholder="Buscar por nombre o correo"
            style={{ width: 260 }}
            onSearch={(value) =>
              setFilters((prev) => ({
                ...prev,
                search: value || undefined,
              }))
            }
          />

          <Select
            allowClear
            placeholder="Filtrar por rol"
            style={{ width: 200 }}
            onChange={(value?: Exclude<TenantUserRole, "PATIENT">) =>
              setFilters((prev) => ({
                ...prev,
                role: value,
              }))
            }
            options={USER_ROLE_OPTIONS}
          />

          <Select
            allowClear
            placeholder="Filtrar por estado"
            style={{ width: 200 }}
            onChange={(value?: TenantUserStatus) =>
              setFilters((prev) => ({
                ...prev,
                status: value,
              }))
            }
            options={[
              { value: "ACTIVE", label: "Activo" },
              { value: "INACTIVE", label: "Inactivo" },
              { value: "SUSPENDED", label: "Suspendido" },
            ]}
          />
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={visibleUsers}
          loading={usersQuery.isLoading}
          pagination={{
            pageSize: 8,
          }}
          scroll={{ x: 1000 }}
        />
      </Space>

      <UserFormModal
        open={modalOpen}
        user={selectedUser}
        loading={loadingAction}
        onCancel={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}