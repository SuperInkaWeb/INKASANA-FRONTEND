import { useState } from "react";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Input,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useQuery } from "@tanstack/react-query";

import { doctorService } from "../../doctors/services/doctor.service";
import type { Doctor, DoctorStatus } from "../../doctors/types/doctor.types";
import { DoctorAvailabilityManager } from "../components/DoctorAvailabilityManager";

const { Title, Text } = Typography;

function getStatusColor(value: DoctorStatus) {
  if (value === "ACTIVE") return "green";
  if (value === "INACTIVE") return "default";
  return "orange";
}

function getStatusLabel(value: DoctorStatus) {
  if (value === "ACTIVE") return "Activo";
  if (value === "INACTIVE") return "Inactivo";
  return "Suspendido";
}

export function ClinicAgendaPage() {
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const doctorsQuery = useQuery({
    queryKey: ["doctors", { search: search.trim() || undefined }],
    queryFn: () =>
      doctorService.findAll({ search: search.trim() || undefined }),
  });

  const doctors = doctorsQuery.data ?? [];

  if (selectedDoctor) {
    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => setSelectedDoctor(null)}
        >
          Volver a la lista de doctores
        </Button>

        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Agenda de {selectedDoctor.fullName}
          </Title>
          <Space>
            {selectedDoctor.specialties?.map((specialty) => (
              <Tag key={specialty.id} color="blue">
                {specialty.name}
              </Tag>
            ))}
          </Space>
        </div>

        <DoctorAvailabilityManager doctorId={selectedDoctor.id} canEdit />
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Agenda de la organización
        </Title>
        <Text type="secondary">
          Selecciona un doctor para configurar su horario y excepciones
        </Text>
      </div>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Input.Search
            placeholder="Buscar doctor por nombre"
            allowClear
            onSearch={setSearch}
            style={{ maxWidth: 320 }}
          />

          <Table<Doctor>
            rowKey="id"
            loading={doctorsQuery.isLoading}
            dataSource={doctors}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty description="No hay doctores registrados" />,
            }}
            columns={[
              {
                title: "Doctor",
                dataIndex: "fullName",
                render: (value: string, record) => (
                  <Space>
                    <Avatar
                      src={record.profileImageUrl || undefined}
                      icon={<UserOutlined />}
                    />
                    {value}
                  </Space>
                ),
              },
              {
                title: "Especialidades",
                dataIndex: "specialties",
                render: (_, record) =>
                  record.specialties?.length ? (
                    <Space wrap>
                      {record.specialties.map((specialty) => (
                        <Tag key={specialty.id} color="blue">
                          {specialty.name}
                        </Tag>
                      ))}
                    </Space>
                  ) : (
                    <Tag>Sin especialidades</Tag>
                  ),
              },
              {
                title: "Estado",
                dataIndex: "status",
                render: (value: DoctorStatus) => (
                  <Tag color={getStatusColor(value)}>
                    {getStatusLabel(value)}
                  </Tag>
                ),
              },
              {
                title: "Acciones",
                key: "actions",
                render: (_, record) => (
                  <Button
                    icon={<CalendarOutlined />}
                    onClick={() => setSelectedDoctor(record)}
                  >
                    Gestionar horario
                  </Button>
                ),
              },
            ]}
          />
        </Space>
      </Card>
    </Space>
  );
}