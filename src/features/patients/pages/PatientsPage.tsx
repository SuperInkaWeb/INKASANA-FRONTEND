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
import { useEffect, useState } from "react";

import {
  activatePatient,
  createPatient,
  deactivatePatient,
  getPatientProfile,
  getPatients,
  updatePatient,
} from "../api/patients.api";
import { PatientForm } from "../components/PatientForm";
import { PatientProfileDrawer } from "../components/PatientProfileDrawer";
import type {
  CreatePatientRequest,
  Patient,
  PatientStatus,
} from "../types/patient.types";

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
    };

    return (
      apiError.response?.data?.message ||
      apiError.response?.data?.error ||
      fallback
    );
  }

  return fallback;
}

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PatientStatus | undefined>();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const loadPatients = async () => {
    setLoading(true);

    try {
      const data = await getPatients({
        search: search || undefined,
        status,
      });

      setPatients(data);
    } catch (error) {
      message.error(
        getErrorMessage(error, "No se pudieron cargar los pacientes")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [status]);

  const handleSave = async (values: CreatePatientRequest) => {
    setSaving(true);

    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, values);
      } else {
        await createPatient(values);
      }

      message.success("Paciente guardado correctamente");
      setFormOpen(false);
      setEditingPatient(null);
      await loadPatients();
    } catch (error) {
      message.error(
        getErrorMessage(error, "No se pudo guardar el paciente")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleProfile = async (id: string) => {
    try {
      const data = await getPatientProfile(id);
      setSelectedPatient(data);
      setProfileOpen(true);
    } catch (error) {
      message.error(
        getErrorMessage(error, "No se pudo cargar el perfil del paciente")
      );
    }
  };

  const changeStatus = async (patient: Patient) => {
    try {
      if (patient.status === "ACTIVE") {
        await deactivatePatient(patient.id);
      } else {
        await activatePatient(patient.id);
      }

      message.success("Estado actualizado");
      await loadPatients();
    } catch (error) {
      message.error(
        getErrorMessage(error, "No se pudo actualizar el estado")
      );
    }
  };

  return (
    <Card
      title="Pacientes"
      extra={
        <Button
          type="primary"
          onClick={() => {
            setEditingPatient(null);
            setFormOpen(true);
          }}
        >
          Nuevo paciente
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Buscar por nombre, identificación o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={loadPatients}
          allowClear
        />

        <Select
          placeholder="Estado"
          allowClear
          style={{ width: 180 }}
          value={status}
          onChange={setStatus}
          options={[
            { value: "ACTIVE", label: "Activos" },
            { value: "INACTIVE", label: "Inactivos" },
          ]}
        />
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={patients}
        columns={[
          {
            title: "Nombre",
            dataIndex: "fullName",
          },
          {
            title: "Identificación",
            dataIndex: "identification",
            render: (value) => value || "-",
          },
          {
            title: "Teléfono",
            dataIndex: "phone",
            render: (value) => value || "-",
          },
          {
            title: "Email",
            dataIndex: "email",
            render: (value) => value || "-",
          },
          {
            title: "Estado",
            dataIndex: "status",
            render: (value: PatientStatus) => (
              <Tag color={value === "ACTIVE" ? "green" : "red"}>
                {value}
              </Tag>
            ),
          },
          {
            title: "Acciones",
            render: (_, record: Patient) => (
              <Space wrap>
                <Button onClick={() => handleProfile(record.id)}>
                  Ver
                </Button>

                <Button
                  onClick={() => {
                    setEditingPatient(record);
                    setFormOpen(true);
                  }}
                >
                  Editar
                </Button>

                <Popconfirm
                  title="¿Cambiar estado del paciente?"
                  onConfirm={() => changeStatus(record)}
                >
                  <Button danger={record.status === "ACTIVE"}>
                    {record.status === "ACTIVE" ? "Desactivar" : "Activar"}
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <PatientForm
        open={formOpen}
        patient={editingPatient}
        loading={saving}
        onCancel={() => {
          setFormOpen(false);
          setEditingPatient(null);
        }}
        onSubmit={handleSave}
      />

      <PatientProfileDrawer
        open={profileOpen}
        patient={selectedPatient}
        onClose={() => setProfileOpen(false)}
      />
    </Card>
  );
}