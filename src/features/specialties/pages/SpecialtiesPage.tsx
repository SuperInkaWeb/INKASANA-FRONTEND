import {
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  activateSpecialty,
  createSpecialty,
  deactivateSpecialty,
  getSpecialties,
  updateSpecialty,
} from "../api/specialties.api";
import { SpecialtyFormModal } from "../components/SpecialtyFormModal";
import type {
  CreateGlobalSpecialtyRequest,
  GlobalSpecialty,
  SpecialtyStatus,
} from "../types/specialty.types";

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const apiError = error as {
      response?: { data?: { message?: string; error?: string } };
    };

    return (
      apiError.response?.data?.message ??
      apiError.response?.data?.error ??
      fallback
    );
  }

  return fallback;
}

export function SpecialtiesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SpecialtyStatus | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] =
    useState<GlobalSpecialty | null>(null);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      status,
    }),
    [search, status]
  );

  const specialtiesQuery = useQuery({
    queryKey: ["specialties", queryParams],
    queryFn: () => getSpecialties(queryParams),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["specialties"] });
  };

  const createMutation = useMutation({
    mutationFn: createSpecialty,
    onSuccess: () => {
      message.success("Especialidad creada correctamente");
      setModalOpen(false);
      refresh();
    },
    onError: (error) => {
      message.error(getErrorMessage(error, "No se pudo crear la especialidad"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: CreateGlobalSpecialtyRequest;
    }) => updateSpecialty(id, values),
    onSuccess: () => {
      message.success("Especialidad actualizada correctamente");
      setModalOpen(false);
      setEditingSpecialty(null);
      refresh();
    },
    onError: (error) => {
      message.error(
        getErrorMessage(error, "No se pudo actualizar la especialidad")
      );
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateSpecialty,
    onSuccess: () => {
      message.success("Especialidad activada correctamente");
      refresh();
    },
    onError: (error) => {
      message.error(
        getErrorMessage(error, "No se pudo activar la especialidad")
      );
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateSpecialty,
    onSuccess: () => {
      message.success("Especialidad desactivada correctamente");
      refresh();
    },
    onError: (error) => {
      message.error(
        getErrorMessage(error, "No se pudo desactivar la especialidad")
      );
    },
  });

  const handleSubmit = (values: CreateGlobalSpecialtyRequest) => {
    if (editingSpecialty) {
      updateMutation.mutate({ id: editingSpecialty.id, values });
      return;
    }

    createMutation.mutate(values);
  };

  return (
    <Card
      title="Especialidades"
      extra={
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Nueva especialidad
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          allowClear
          placeholder="Buscar por nombre"
          onSearch={setSearch}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: 260 }}
        />

        <Select
          allowClear
          placeholder="Filtrar por estado"
          value={status}
          onChange={setStatus}
          style={{ width: 200 }}
          options={[
            { value: "ACTIVE", label: "Activas" },
            { value: "INACTIVE", label: "Inactivas" },
          ]}
        />
      </Space>

      <Table<GlobalSpecialty>
        rowKey="id"
        loading={specialtiesQuery.isLoading}
        dataSource={specialtiesQuery.data ?? []}
        pagination={{ pageSize: 10 }}
        columns={[
          {
            title: "Nombre",
            dataIndex: "name",
          },
          {
            title: "Slug",
            dataIndex: "slug",
          },
          {
            title: "Estado",
            dataIndex: "status",
            render: (value: SpecialtyStatus) => (
              <Tag color={value === "ACTIVE" ? "green" : "red"}>{value}</Tag>
            ),
          },
          {
            title: "Descripción",
            dataIndex: "description",
          },
          {
            title: "Acciones",
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() => {
                    setEditingSpecialty(record);
                    setModalOpen(true);
                  }}
                >
                  Editar
                </Button>

                {record.status === "ACTIVE" ? (
                  <Popconfirm
                    title="¿Desactivar especialidad?"
                    onConfirm={() => deactivateMutation.mutate(record.id)}
                  >
                    <Button danger>Desactivar</Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="¿Activar especialidad?"
                    onConfirm={() => activateMutation.mutate(record.id)}
                  >
                    <Button>Activar</Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />

      <SpecialtyFormModal
        open={modalOpen}
        loading={createMutation.isPending || updateMutation.isPending}
        specialty={editingSpecialty}
        onCancel={() => {
          setModalOpen(false);
          setEditingSpecialty(null);
        }}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}