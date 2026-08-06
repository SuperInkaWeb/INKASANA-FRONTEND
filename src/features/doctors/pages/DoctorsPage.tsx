import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  TimePicker,
  Typography,
  Upload,
  type UploadProps,
} from "antd";
import { InboxOutlined, UserOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { doctorService } from "../services/doctor.service";
import type {
  CreateDoctorRequest,
  Doctor,
  DoctorStatus,
  DoctorVerificationStatus,
} from "../types/doctor.types";
import { getActiveSpecialties } from "../../specialties/api/specialties.api";
import { getUsers } from "../../users/api/users.api";
import type { TenantUser } from "../../users/types/user.types";

type DoctorFormValues = CreateDoctorRequest & {
  availableHours?: [Dayjs, Dayjs] | null;
};

const { Text } = Typography;

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_SIZE_MB = 5;

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
      };
    };

    return (
      apiError.response?.data?.message ??
      apiError.response?.data?.error ??
      fallback
    );
  }

  return fallback;
}

export function DoctorsPage() {
  const [form] = Form.useForm<DoctorFormValues>();
  const [rejectForm] = Form.useForm<{ reason: string }>();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DoctorStatus | undefined>();
  const [verificationStatus, setVerificationStatus] = useState<
    DoctorVerificationStatus | undefined
  >();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingDoctor, setRejectingDoctor] = useState<Doctor | null>(null);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      status,
    }),
    [search, status]
  );

  const doctorsQuery = useQuery({
    queryKey: ["doctors", queryParams],
    queryFn: () => doctorService.findAll(queryParams),
  });

  const usersQuery = useQuery({
    queryKey: ["tenant-users", "doctors"],
    queryFn: () => getUsers({ role: "DOCTOR" }),
  });

  const specialtiesQuery = useQuery({
    queryKey: ["active-specialties"],
    queryFn: getActiveSpecialties,
  });

  const doctorUsers =
    usersQuery.data?.filter((user: TenantUser) => user.role === "DOCTOR") ?? [];

  const specialties = specialtiesQuery.data ?? [];

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["doctors"] });
  };

  const filteredDoctors = useMemo(() => {
    const doctors = doctorsQuery.data ?? [];

    if (!verificationStatus) {
      return doctors;
    }

    return doctors.filter(
      (doctor) => doctor.verificationStatus === verificationStatus
    );
  }, [doctorsQuery.data, verificationStatus]);

  const createMutation = useMutation({
    mutationFn: doctorService.create,
    onSuccess: () => {
      message.success("Doctor creado correctamente");
      closeModal();
      refresh();
    },
    onError: (error) => {
      message.error(getErrorMessage(error, "No se pudo crear el doctor"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Partial<CreateDoctorRequest>;
    }) => doctorService.update(id, values),
    onSuccess: () => {
      message.success("Doctor actualizado correctamente");
      closeModal();
      refresh();
    },
    onError: (error) => {
      message.error(getErrorMessage(error, "No se pudo actualizar el doctor"));
    },
  });

  const activateMutation = useMutation({
    mutationFn: doctorService.activate,
    onSuccess: () => {
      message.success("Doctor activado correctamente");
      refresh();
    },
    onError: (error) => {
      message.error(getErrorMessage(error, "No se pudo activar el doctor"));
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: doctorService.deactivate,
    onSuccess: () => {
      message.success("Doctor desactivado correctamente");
      refresh();
    },
    onError: (error) => {
      message.error(getErrorMessage(error, "No se pudo desactivar el doctor"));
    },
  });

  const approveMutation = useMutation({
    mutationFn: doctorService.approve,
    onSuccess: () => {
      message.success("Doctor aprobado correctamente");
      refresh();
    },
    onError: (error) => {
      message.error(getErrorMessage(error, "No se pudo aprobar el doctor"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      doctorService.reject(id, reason),
    onSuccess: () => {
      message.success("Doctor rechazado correctamente");
      closeRejectModal();
      refresh();
    },
    onError: (error) => {
      message.error(getErrorMessage(error, "No se pudo rechazar el doctor"));
    },
  });

  const handleOpenCreateModal = () => {
    setEditingDoctor(null);
    form.resetFields();
    form.setFieldsValue({
      specialtyIds: [],
    });
    setPendingPhotoFile(null);
    setPhotoPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);

    form.setFieldsValue({
      tenantUserId: doctor.tenantUserId,
      fullName: doctor.fullName,
      specialtyIds: doctor.specialties?.map((item) => item.id) ?? [],
      licenseNumber: doctor.licenseNumber ?? undefined,
      email: doctor.email ?? undefined,
      phone: doctor.phone ?? undefined,
      bio: doctor.bio ?? undefined,
      consultationPrice: doctor.consultationPrice ?? undefined,
      consultationDurationMinutes:
        doctor.consultationDurationMinutes ?? undefined,
      availableDays: doctor.availableDays ?? [],
      availableHours:
        doctor.availableStartTime && doctor.availableEndTime
          ? [
              dayjs(doctor.availableStartTime, "HH:mm"),
              dayjs(doctor.availableEndTime, "HH:mm"),
            ]
          : null,
    });

    setPendingPhotoFile(null);
    setPhotoPreviewUrl(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
    setPendingPhotoFile(null);
    setPhotoPreviewUrl(null);
    form.resetFields();
  };

  const handleOpenRejectModal = (doctor: Doctor) => {
    setRejectingDoctor(doctor);
    rejectForm.resetFields();
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setRejectingDoctor(null);
    rejectForm.resetFields();
  };

  const handleSubmit = async (values: DoctorFormValues) => {
    const { availableHours, ...rest } = values;

    // La foto ya no se envía como texto: se sube por drag & drop y se
    // asocia al doctor en un paso aparte, después de guardarlo (ver abajo).
    const payload: CreateDoctorRequest = {
      ...rest,
      fullName: values.fullName.trim(),
      specialtyIds: values.specialtyIds ?? [],
      licenseNumber: values.licenseNumber?.trim() || undefined,
      email: values.email?.trim().toLowerCase() || undefined,
      phone: values.phone?.trim() || undefined,
      bio: values.bio?.trim() || undefined,
      availableDays: values.availableDays ?? [],
      availableStartTime: availableHours?.[0]
        ? availableHours[0].format("HH:mm")
        : undefined,
      availableEndTime: availableHours?.[1]
        ? availableHours[1].format("HH:mm")
        : undefined,
    };

    try {
      const savedDoctor = editingDoctor
        ? await updateMutation.mutateAsync({
            id: editingDoctor.id,
            values: payload,
          })
        : await createMutation.mutateAsync(payload);

      if (pendingPhotoFile) {
        try {
          setIsUploadingPhoto(true);
          await doctorService.uploadPhoto(savedDoctor.id, pendingPhotoFile);
          message.success("Foto del doctor actualizada");
          refresh();
        } catch (error) {
          message.error(
            getErrorMessage(error, "No se pudo subir la foto del doctor")
          );
        } finally {
          setIsUploadingPhoto(false);
        }
      }
    } catch {
      // El mensaje de error ya lo muestra el onError de cada mutación
    }
  };

  const handleRejectSubmit = (values: { reason: string }) => {
    if (!rejectingDoctor) return;

    rejectMutation.mutate({
      id: rejectingDoctor.id,
      reason: values.reason.trim(),
    });
  };

  const getStatusColor = (value: DoctorStatus) => {
    if (value === "ACTIVE") return "green";
    if (value === "INACTIVE") return "default";
    return "orange";
  };

  const getStatusLabel = (value: DoctorStatus) => {
    if (value === "ACTIVE") return "Activo";
    if (value === "INACTIVE") return "Inactivo";
    return "Suspendido";
  };

  const getVerificationColor = (value: DoctorVerificationStatus) => {
    if (value === "APPROVED") return "green";
    if (value === "REJECTED") return "red";
    return "orange";
  };

  const getVerificationLabel = (value: DoctorVerificationStatus) => {
    if (value === "APPROVED") return "Aprobado";
    if (value === "REJECTED") return "Rechazado";
    return "Pendiente";
  };

  return (
    <Card
      title="Doctores de la clínica"
      extra={
        <Button type="primary" onClick={handleOpenCreateModal}>
          Nuevo doctor
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          allowClear
          placeholder="Buscar por nombre, especialidad o email"
          onSearch={setSearch}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: 320 }}
        />

        <Select
          allowClear
          placeholder="Filtrar por estado"
          value={status}
          onChange={setStatus}
          style={{ width: 200 }}
          options={[
            { value: "ACTIVE", label: "Activos" },
            { value: "INACTIVE", label: "Inactivos" },
            { value: "SUSPENDED", label: "Suspendidos" },
          ]}
        />

        <Select
          allowClear
          placeholder="Filtrar por validación"
          value={verificationStatus}
          onChange={setVerificationStatus}
          style={{ width: 220 }}
          options={[
            { value: "PENDING", label: "Pendientes" },
            { value: "APPROVED", label: "Aprobados" },
            { value: "REJECTED", label: "Rechazados" },
          ]}
        />
      </Space>

      <Table<Doctor>
        rowKey="id"
        loading={doctorsQuery.isLoading}
        dataSource={filteredDoctors}
        pagination={{ pageSize: 10 }}
        columns={[
          {
            title: "Nombre",
            dataIndex: "fullName",
            key: "fullName",
          },
          {
            title: "Especialidades",
            dataIndex: "specialties",
            key: "specialties",
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
            title: "Licencia",
            dataIndex: "licenseNumber",
            key: "licenseNumber",
            render: (value) => value || "N/A",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (value) => value || "N/A",
          },
          {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
            render: (value) => value || "N/A",
          },
          {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            render: (value: DoctorStatus) => (
              <Tag color={getStatusColor(value)}>{getStatusLabel(value)}</Tag>
            ),
          },
          {
            title: "Validación",
            dataIndex: "verificationStatus",
            key: "verificationStatus",
            render: (value: DoctorVerificationStatus, record) => (
              <Space direction="vertical" size={2}>
                <Tag color={getVerificationColor(value)}>
                  {getVerificationLabel(value)}
                </Tag>

                {value === "REJECTED" && record.rejectionReason && (
                  <span style={{ fontSize: 12, color: "#999" }}>
                    {record.rejectionReason}
                  </span>
                )}
              </Space>
            ),
          },
          {
            title: "Acciones",
            key: "actions",
            render: (_, record) => (
              <Space wrap>
                <Button
                  size="small"
                  onClick={() => navigate(`/doctors/${record.id}`)}
                >
                  Ver perfil
                </Button>

                <Button size="small" onClick={() => handleOpenEditModal(record)}>
                  Editar
                </Button>

                {record.verificationStatus !== "APPROVED" && (
                  <Popconfirm
                    title="Aprobar doctor"
                    description="¿Seguro que deseas aprobar profesionalmente este doctor?"
                    okText="Sí, aprobar"
                    cancelText="Cancelar"
                    onConfirm={() => approveMutation.mutate(record.id)}
                  >
                    <Button
                      size="small"
                      type="primary"
                      loading={
                        approveMutation.isPending &&
                        approveMutation.variables === record.id
                      }
                    >
                      Aprobar
                    </Button>
                  </Popconfirm>
                )}

                {record.verificationStatus !== "REJECTED" && (
                  <Button
                    size="small"
                    danger
                    onClick={() => handleOpenRejectModal(record)}
                  >
                    Rechazar
                  </Button>
                )}

                {record.status === "ACTIVE" ? (
                  <Popconfirm
                    title="Desactivar doctor"
                    description="¿Seguro que deseas desactivar este doctor?"
                    okText="Sí, desactivar"
                    cancelText="Cancelar"
                    onConfirm={() => deactivateMutation.mutate(record.id)}
                  >
                    <Button size="small" danger>
                      Desactivar
                    </Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="Activar doctor"
                    description="¿Seguro que deseas activar este doctor?"
                    okText="Sí, activar"
                    cancelText="Cancelar"
                    onConfirm={() => activateMutation.mutate(record.id)}
                  >
                    <Button size="small">Activar</Button>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingDoctor ? "Editar doctor" : "Nuevo doctor"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={
          createMutation.isPending ||
          updateMutation.isPending ||
          isUploadingPhoto
        }
        okText={editingDoctor ? "Actualizar" : "Guardar"}
        cancelText="Cancelar"
        width={720}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Usuario doctor"
            name="tenantUserId"
            rules={[
              {
                required: true,
                message: "Selecciona un usuario con rol DOCTOR",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              loading={usersQuery.isLoading}
              placeholder="Selecciona un usuario doctor"
              optionFilterProp="label"
              disabled={!!editingDoctor}
              options={doctorUsers.map((user) => ({
                label: `${user.fullName} - ${user.email}`,
                value: user.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Nombre completo"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Ingresa el nombre completo",
              },
            ]}
          >
            <Input placeholder="Ej: Dr. Juan Pérez" />
          </Form.Item>

          <Form.Item label="Especialidades" name="specialtyIds">
            <Select
              mode="multiple"
              allowClear
              showSearch
              loading={specialtiesQuery.isLoading}
              placeholder="Selecciona una o más especialidades"
              optionFilterProp="label"
              options={specialties.map((specialty) => ({
                label: specialty.name,
                value: specialty.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Número de licencia"
            name="licenseNumber"
            rules={[
              {
                required: true,
                message: "La licencia profesional es obligatoria",
              },
            ]}
          >
            <Input placeholder="Ej: MED-12345" />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input placeholder="doctor@email.com" />
          </Form.Item>

          <Form.Item label="Teléfono" name="phone">
            <Input placeholder="0999999999" />
          </Form.Item>

          <Form.Item label="Biografía profesional" name="bio">
            <Input.TextArea
              rows={4}
              placeholder="Experiencia, formación, enfoque médico..."
            />
          </Form.Item>

          <Form.Item label="Precio de consulta" name="consultationPrice">
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              placeholder="Ej: 25.00"
            />
          </Form.Item>

          <Form.Item
            label="Duración de consulta en minutos"
            name="consultationDurationMinutes"
          >
            <InputNumber
              min={5}
              max={240}
              style={{ width: "100%" }}
              placeholder="Ej: 30"
            />
          </Form.Item>

          <Form.Item label="Foto del doctor">
            <Upload.Dragger
              accept={ALLOWED_PHOTO_TYPES.join(",")}
              multiple={false}
              maxCount={1}
              showUploadList={false}
              disabled={isUploadingPhoto}
              beforeUpload={((file: File) => {
                if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
                  message.error("Solo se permiten imágenes JPG, PNG o WEBP");
                  return Upload.LIST_IGNORE;
                }

                if (file.size / 1024 / 1024 > MAX_PHOTO_SIZE_MB) {
                  message.error(
                    `La imagen no puede superar los ${MAX_PHOTO_SIZE_MB} MB`
                  );
                  return Upload.LIST_IGNORE;
                }

                setPendingPhotoFile(file);
                setPhotoPreviewUrl(URL.createObjectURL(file));

                // Evitamos que antd suba el archivo por su cuenta: lo
                // subimos nosotros mismos después de guardar el doctor.
                return false;
              }) as UploadProps["beforeUpload"]}
            >
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%", padding: "12px 0" }}
              >
                <Avatar
                  size={80}
                  src={photoPreviewUrl || editingDoctor?.profileImageUrl || undefined}
                  icon={<UserOutlined />}
                />

                <Space direction="vertical" align="center" size={0}>
                  <span>
                    <InboxOutlined style={{ marginRight: 6 }} />
                    Arrastra una foto aquí o haz clic para seleccionarla
                  </span>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    JPG, PNG o WEBP · máx. {MAX_PHOTO_SIZE_MB} MB
                  </Text>
                </Space>
              </Space>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="Días disponibles" name="availableDays">
            <Select
              mode="multiple"
              allowClear
              placeholder="Selecciona los días"
              options={[
                { label: "Lunes", value: "MONDAY" },
                { label: "Martes", value: "TUESDAY" },
                { label: "Miércoles", value: "WEDNESDAY" },
                { label: "Jueves", value: "THURSDAY" },
                { label: "Viernes", value: "FRIDAY" },
                { label: "Sábado", value: "SATURDAY" },
                { label: "Domingo", value: "SUNDAY" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Horario de atención" name="availableHours">
            <TimePicker.RangePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Rechazar validación profesional"
        open={isRejectModalOpen}
        onCancel={closeRejectModal}
        onOk={() => rejectForm.submit()}
        confirmLoading={rejectMutation.isPending}
        okText="Rechazar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
        destroyOnHidden
      >
        <Form
          form={rejectForm}
          layout="vertical"
          onFinish={handleRejectSubmit}
        >
          <Form.Item
            label="Motivo de rechazo"
            name="reason"
            rules={[
              {
                required: true,
                message: "Ingresa el motivo de rechazo",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Ej: Licencia profesional inválida o documentación incompleta"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}