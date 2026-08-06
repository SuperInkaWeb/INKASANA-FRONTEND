import { useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  TimePicker,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { agendaService } from "../services/agenda.service";
import {
  AVAILABILITY_EXCEPTION_TYPE_LABELS,
  DAY_OF_WEEK_LABELS,
  DAY_OF_WEEK_ORDER,
  type AvailabilityException,
  type AvailabilityExceptionType,
  type CreateAvailabilityExceptionRequest,
  type CreateDoctorAvailabilityRequest,
  type DayOfWeek,
  type DoctorAvailability,
  type UpdateAvailabilityExceptionRequest,
  type UpdateDoctorAvailabilityRequest,
} from "../types/agenda.types";

const { Text } = Typography;

const TIME_FORMAT = "HH:mm";
const TIME_FORMAT_BACKEND = "HH:mm:ss";

type AvailabilityFormValues = {
  dayOfWeek: DayOfWeek;
  hours: [Dayjs, Dayjs];
  active: boolean;
};

type ExceptionFormValues = {
  exceptionDate: Dayjs;
  type: AvailabilityExceptionType;
  hours?: [Dayjs, Dayjs];
  reason?: string;
};

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

function formatTime(value: string | null) {
  if (!value) return "N/A";
  return value.slice(0, 5);
}

type Props = {
  doctorId: string;
  canEdit?: boolean;
};

export function DoctorAvailabilityManager({ doctorId, canEdit = true }: Props) {
  const queryClient = useQueryClient();

  const [availabilityForm] = Form.useForm<AvailabilityFormValues>();
  const [exceptionForm] = Form.useForm<ExceptionFormValues>();

  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] =
    useState<DoctorAvailability | null>(null);

  const [isExceptionModalOpen, setIsExceptionModalOpen] = useState(false);
  const [editingException, setEditingException] =
    useState<AvailabilityException | null>(null);
  const [exceptionType, setExceptionType] =
    useState<AvailabilityExceptionType>("UNAVAILABLE");

  const availabilityQuery = useQuery({
    queryKey: ["doctor-availability", doctorId],
    queryFn: () => agendaService.findAvailability(doctorId),
    enabled: !!doctorId,
  });

  const exceptionsQuery = useQuery({
    queryKey: ["doctor-availability-exceptions", doctorId],
    queryFn: () => agendaService.findExceptions(doctorId),
    enabled: !!doctorId,
  });

  const invalidateAvailability = () =>
    queryClient.invalidateQueries({
      queryKey: ["doctor-availability", doctorId],
    });

  const invalidateExceptions = () =>
    queryClient.invalidateQueries({
      queryKey: ["doctor-availability-exceptions", doctorId],
    });

  const createAvailabilityMutation = useMutation({
    mutationFn: (payload: CreateDoctorAvailabilityRequest) =>
      agendaService.createAvailability(doctorId, payload),
    onSuccess: () => {
      message.success("Bloque de horario creado");
      invalidateAvailability();
      closeAvailabilityModal();
    },
    onError: (error) =>
      message.error(getErrorMessage(error, "No se pudo crear el bloque")),
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (vars: {
      availabilityId: string;
      payload: UpdateDoctorAvailabilityRequest;
    }) =>
      agendaService.updateAvailability(
        doctorId,
        vars.availabilityId,
        vars.payload
      ),
    onSuccess: () => {
      message.success("Bloque de horario actualizado");
      invalidateAvailability();
      closeAvailabilityModal();
    },
    onError: (error) =>
      message.error(getErrorMessage(error, "No se pudo actualizar el bloque")),
  });

  const deleteAvailabilityMutation = useMutation({
    mutationFn: (availabilityId: string) =>
      agendaService.deleteAvailability(doctorId, availabilityId),
    onSuccess: () => {
      message.success("Bloque de horario eliminado");
      invalidateAvailability();
    },
    onError: (error) =>
      message.error(getErrorMessage(error, "No se pudo eliminar el bloque")),
  });

  const createExceptionMutation = useMutation({
    mutationFn: (payload: CreateAvailabilityExceptionRequest) =>
      agendaService.createException(doctorId, payload),
    onSuccess: () => {
      message.success("Excepción creada");
      invalidateExceptions();
      closeExceptionModal();
    },
    onError: (error) =>
      message.error(getErrorMessage(error, "No se pudo crear la excepción")),
  });

  const updateExceptionMutation = useMutation({
    mutationFn: (vars: {
      exceptionId: string;
      payload: UpdateAvailabilityExceptionRequest;
    }) =>
      agendaService.updateException(doctorId, vars.exceptionId, vars.payload),
    onSuccess: () => {
      message.success("Excepción actualizada");
      invalidateExceptions();
      closeExceptionModal();
    },
    onError: (error) =>
      message.error(
        getErrorMessage(error, "No se pudo actualizar la excepción")
      ),
  });

  const deleteExceptionMutation = useMutation({
    mutationFn: (exceptionId: string) =>
      agendaService.deleteException(doctorId, exceptionId),
    onSuccess: () => {
      message.success("Excepción eliminada");
      invalidateExceptions();
    },
    onError: (error) =>
      message.error(
        getErrorMessage(error, "No se pudo eliminar la excepción")
      ),
  });

  // ---- Modal de bloque de horario semanal ----

  const openCreateAvailabilityModal = () => {
    setEditingAvailability(null);
    availabilityForm.resetFields();
    availabilityForm.setFieldsValue({ active: true });
    setIsAvailabilityModalOpen(true);
  };

  const openEditAvailabilityModal = (record: DoctorAvailability) => {
    setEditingAvailability(record);
    availabilityForm.setFieldsValue({
      dayOfWeek: record.dayOfWeek,
      hours: [
        dayjs(record.startTime, TIME_FORMAT_BACKEND),
        dayjs(record.endTime, TIME_FORMAT_BACKEND),
      ],
      active: record.active,
    });
    setIsAvailabilityModalOpen(true);
  };

  const closeAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false);
    setEditingAvailability(null);
    availabilityForm.resetFields();
  };

  const handleAvailabilitySubmit = async () => {
    const values = await availabilityForm.validateFields();
    const [start, end] = values.hours;

    const payload = {
      dayOfWeek: values.dayOfWeek,
      startTime: start.format(TIME_FORMAT_BACKEND),
      endTime: end.format(TIME_FORMAT_BACKEND),
      active: values.active,
    };

    if (editingAvailability) {
      updateAvailabilityMutation.mutate({
        availabilityId: editingAvailability.id,
        payload,
      });
    } else {
      createAvailabilityMutation.mutate(payload);
    }
  };

  // ---- Modal de excepción puntual ----

  const openCreateExceptionModal = () => {
    setEditingException(null);
    setExceptionType("UNAVAILABLE");
    exceptionForm.resetFields();
    exceptionForm.setFieldsValue({ type: "UNAVAILABLE" });
    setIsExceptionModalOpen(true);
  };

  const openEditExceptionModal = (record: AvailabilityException) => {
    setEditingException(record);
    setExceptionType(record.type);
    exceptionForm.setFieldsValue({
      exceptionDate: dayjs(record.exceptionDate),
      type: record.type,
      hours:
        record.startTime && record.endTime
          ? [
              dayjs(record.startTime, TIME_FORMAT_BACKEND),
              dayjs(record.endTime, TIME_FORMAT_BACKEND),
            ]
          : undefined,
      reason: record.reason ?? undefined,
    });
    setIsExceptionModalOpen(true);
  };

  const closeExceptionModal = () => {
    setIsExceptionModalOpen(false);
    setEditingException(null);
    exceptionForm.resetFields();
  };

  const handleExceptionSubmit = async () => {
    const values = await exceptionForm.validateFields();

    const payload = {
      exceptionDate: values.exceptionDate.format("YYYY-MM-DD"),
      type: values.type,
      startTime:
        values.type === "EXTRA" && values.hours
          ? values.hours[0].format(TIME_FORMAT_BACKEND)
          : null,
      endTime:
        values.type === "EXTRA" && values.hours
          ? values.hours[1].format(TIME_FORMAT_BACKEND)
          : null,
      reason: values.reason?.trim() || null,
    };

    if (editingException) {
      updateExceptionMutation.mutate({
        exceptionId: editingException.id,
        payload,
      });
    } else {
      createExceptionMutation.mutate(payload);
    }
  };

  const sortedAvailability = [...(availabilityQuery.data ?? [])].sort(
    (a, b) => {
      const dayDiff =
        DAY_OF_WEEK_ORDER.indexOf(a.dayOfWeek) -
        DAY_OF_WEEK_ORDER.indexOf(b.dayOfWeek);

      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    }
  );

  const sortedExceptions = [...(exceptionsQuery.data ?? [])].sort((a, b) =>
    a.exceptionDate.localeCompare(b.exceptionDate)
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card
        title="Horario semanal recurrente"
        extra={
          canEdit && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateAvailabilityModal}
            >
              Agregar bloque
            </Button>
          )
        }
      >
        <Table<DoctorAvailability>
          rowKey="id"
          loading={availabilityQuery.isLoading}
          dataSource={sortedAvailability}
          pagination={false}
          locale={{
            emptyText: (
              <Empty description="Este doctor aún no configuró bloques de horario" />
            ),
          }}
          columns={[
            {
              title: "Día",
              dataIndex: "dayOfWeek",
              render: (value: DayOfWeek) => DAY_OF_WEEK_LABELS[value],
            },
            {
              title: "Inicio",
              dataIndex: "startTime",
              render: (value: string) => formatTime(value),
            },
            {
              title: "Fin",
              dataIndex: "endTime",
              render: (value: string) => formatTime(value),
            },
            {
              title: "Estado",
              dataIndex: "active",
              render: (active: boolean) => (
                <Tag color={active ? "green" : "default"}>
                  {active ? "Activo" : "Inactivo"}
                </Tag>
              ),
            },
            ...(canEdit
              ? [
                  {
                    title: "Acciones",
                    key: "actions",
                    render: (_: unknown, record: DoctorAvailability) => (
                      <Space>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => openEditAvailabilityModal(record)}
                        />
                        <Popconfirm
                          title="¿Eliminar este bloque de horario?"
                          onConfirm={() =>
                            deleteAvailabilityMutation.mutate(record.id)
                          }
                        >
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Card>

      <Card
        title="Excepciones (vacaciones, feriados, bloques extra)"
        extra={
          canEdit && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateExceptionModal}
            >
              Agregar excepción
            </Button>
          )
        }
      >
        <Table<AvailabilityException>
          rowKey="id"
          loading={exceptionsQuery.isLoading}
          dataSource={sortedExceptions}
          pagination={false}
          locale={{
            emptyText: (
              <Empty description="Este doctor no tiene excepciones registradas" />
            ),
          }}
          columns={[
            {
              title: "Fecha",
              dataIndex: "exceptionDate",
            },
            {
              title: "Tipo",
              dataIndex: "type",
              render: (value: AvailabilityExceptionType) => (
                <Tag color={value === "UNAVAILABLE" ? "red" : "blue"}>
                  {AVAILABILITY_EXCEPTION_TYPE_LABELS[value]}
                </Tag>
              ),
            },
            {
              title: "Horario",
              key: "hours",
              render: (_: unknown, record: AvailabilityException) =>
                record.type === "EXTRA"
                  ? `${formatTime(record.startTime)} - ${formatTime(record.endTime)}`
                  : "Día completo",
            },
            {
              title: "Motivo",
              dataIndex: "reason",
              render: (value: string | null) => value || <Text type="secondary">N/A</Text>,
            },
            ...(canEdit
              ? [
                  {
                    title: "Acciones",
                    key: "actions",
                    render: (_: unknown, record: AvailabilityException) => (
                      <Space>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => openEditExceptionModal(record)}
                        />
                        <Popconfirm
                          title="¿Eliminar esta excepción?"
                          onConfirm={() =>
                            deleteExceptionMutation.mutate(record.id)
                          }
                        >
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </Card>

      <Modal
        title={editingAvailability ? "Editar bloque de horario" : "Nuevo bloque de horario"}
        open={isAvailabilityModalOpen}
        onCancel={closeAvailabilityModal}
        onOk={handleAvailabilitySubmit}
        confirmLoading={
          createAvailabilityMutation.isPending ||
          updateAvailabilityMutation.isPending
        }
        okText="Guardar"
        cancelText="Cancelar"
        destroyOnHidden
      >
        <Form form={availabilityForm} layout="vertical">
          <Form.Item
            name="dayOfWeek"
            label="Día de la semana"
            rules={[{ required: true, message: "Selecciona un día" }]}
          >
            <Select
              options={DAY_OF_WEEK_ORDER.map((day) => ({
                value: day,
                label: DAY_OF_WEEK_LABELS[day],
              }))}
            />
          </Form.Item>

          <Form.Item
            name="hours"
            label="Rango horario"
            rules={[{ required: true, message: "Selecciona el rango horario" }]}
          >
            <TimePicker.RangePicker format={TIME_FORMAT} minuteStep={5} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="active" label="Activo" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingException ? "Editar excepción" : "Nueva excepción"}
        open={isExceptionModalOpen}
        onCancel={closeExceptionModal}
        onOk={handleExceptionSubmit}
        confirmLoading={
          createExceptionMutation.isPending || updateExceptionMutation.isPending
        }
        okText="Guardar"
        cancelText="Cancelar"
        destroyOnHidden
      >
        <Form form={exceptionForm} layout="vertical">
          <Form.Item
            name="exceptionDate"
            label="Fecha"
            rules={[{ required: true, message: "Selecciona una fecha" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Tipo de excepción"
            rules={[{ required: true, message: "Selecciona el tipo" }]}
          >
            <Select
              onChange={(value: AvailabilityExceptionType) => setExceptionType(value)}
              options={[
                { value: "UNAVAILABLE", label: AVAILABILITY_EXCEPTION_TYPE_LABELS.UNAVAILABLE },
                { value: "EXTRA", label: AVAILABILITY_EXCEPTION_TYPE_LABELS.EXTRA },
              ]}
            />
          </Form.Item>

          {exceptionType === "EXTRA" && (
            <Form.Item
              name="hours"
              label="Rango horario del bloque extra"
              rules={[{ required: true, message: "Selecciona el rango horario" }]}
            >
              <TimePicker.RangePicker format={TIME_FORMAT} minuteStep={5} style={{ width: "100%" }} />
            </Form.Item>
          )}

          <Form.Item name="reason" label="Motivo (opcional)">
            <Input placeholder="Ej: Vacaciones, feriado, cobertura extra" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}
