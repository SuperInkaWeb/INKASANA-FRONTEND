import { Button, Card, Form, Input, Modal, Select, Space, Table, Tag, Typography, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "../../../app/store/auth.store";
import { doctorService } from "../../doctors/services/doctor.service";
import { getPatients } from "../../patients/api/patients.api";
import { slotService } from "../../agenda/services/slot.service";
import { appointmentService } from "../services/appointment.service";
import type { Appointment, AppointmentStatus, CreateAppointmentRequest } from "../types/appointment.types";

const { Title, Text } = Typography;
const colors: Record<AppointmentStatus, string> = { PENDING: "gold", CONFIRMED: "blue", PAID: "cyan", CANCELLED: "red", COMPLETED: "green", NO_SHOW: "orange" };
const dateLabel = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export function AppointmentsPage() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<CreateAppointmentRequest>();
  const [doctorId, setDoctorId] = useState<string>();
  const [date, setDate] = useState<string>();
  const { role, roles, userId } = useAuthStore();
  const isDoctor = role === "DOCTOR" || roles.includes("DOCTOR");
  const qc = useQueryClient();
  const from = new Date().toISOString().slice(0, 10);
  const to = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const doctors = useQuery({ queryKey: ["doctors"], queryFn: () => doctorService.findAll() });
  const myDoctor = doctors.data?.find(doctor => doctor.tenantUserId === userId);
  const effectiveDoctorId = isDoctor ? myDoctor?.id : doctorId;
  const appointments = useQuery({ queryKey: ["appointments", effectiveDoctorId], queryFn: () => appointmentService.findAll(isDoctor && effectiveDoctorId ? { doctorId: effectiveDoctorId } : undefined), enabled: !isDoctor || !!effectiveDoctorId });
  const patients = useQuery({ queryKey: ["patients"], queryFn: () => getPatients() });
  const slots = useQuery({ queryKey: ["appointment-slots", effectiveDoctorId], queryFn: () => slotService.findSlots(effectiveDoctorId!, from, to), enabled: !!effectiveDoctorId });
  const refresh = () => qc.invalidateQueries({ queryKey: ["appointments"] });
  const create = useMutation({ mutationFn: appointmentService.create, onSuccess: () => { message.success("Cita agendada"); closeModal(); refresh(); }, onError: () => message.error("No se pudo agendar: el horario puede estar ocupado") });
  const update = useMutation({ mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) => appointmentService.changeStatus(id, status), onSuccess: refresh });
  const cancel = useMutation({ mutationFn: appointmentService.cancel, onSuccess: refresh });
  const availableDays = (slots.data ?? []).filter(day => day.slots.some(slot => slot.available));
  const availableTimes = availableDays.find(day => day.date === date)?.slots.filter(slot => slot.available) ?? [];
  function openModal() { form.resetFields(); setDate(undefined); setDoctorId(isDoctor ? myDoctor?.id : undefined); if (isDoctor && myDoctor) form.setFieldValue("doctorId", myDoctor.id); setOpen(true); }
  function closeModal() { setOpen(false); form.resetFields(); setDoctorId(undefined); setDate(undefined); }

  return <><Space style={{ width: "100%", justifyContent: "space-between" }}><div><Title level={2}>Citas</Title><Text>{isDoctor ? "Consulta y agenda únicamente tus propias atenciones." : "Agenda y gestión de atención médica."}</Text></div><Button type="primary" disabled={isDoctor && !myDoctor} onClick={openModal}>Agendar cita</Button></Space>
    <Card style={{ marginTop: 24 }}><Table<Appointment> rowKey="id" loading={appointments.isLoading || doctors.isLoading} dataSource={appointments.data} locale={{ emptyText: isDoctor ? "Todavía no tienes citas registradas" : "Todavía no hay citas registradas" }} columns={[{ title: "Fecha", render: (_, a) => `${a.date} ${a.time.slice(0, 5)}` }, { title: "Paciente", dataIndex: "patientName" }, { title: "Doctor", dataIndex: "doctorName" }, { title: "Motivo", dataIndex: "reason" }, { title: "Estado", render: (_, a) => <Tag color={colors[a.status]}>{a.status}</Tag> }, { title: "Acciones", render: (_, a) => a.status === "CANCELLED" ? null : <Space><Select size="small" value={a.status} style={{ width: 120 }} onChange={(status: AppointmentStatus) => update.mutate({ id: a.id, status })} options={["PENDING", "CONFIRMED", "PAID", "COMPLETED", "NO_SHOW"].map(value => ({ value }))} /><Button danger size="small" onClick={() => cancel.mutate(a.id)}>Cancelar</Button></Space> }]} /></Card>
    <Modal title="Agendar cita" open={open} onCancel={closeModal} confirmLoading={create.isPending} onOk={() => form.validateFields().then(create.mutate)}><Form form={form} layout="vertical"><Form.Item name="patientId" label="Paciente" rules={[{ required: true }]}><Select showSearch optionFilterProp="label" options={patients.data?.map(p => ({ value: p.id, label: p.fullName }))} /></Form.Item><Form.Item name="doctorId" label="Doctor" rules={[{ required: true }]}>{isDoctor ? <Select disabled value={myDoctor?.id} options={myDoctor ? [{ value: myDoctor.id, label: myDoctor.fullName }] : []} /> : <Select showSearch optionFilterProp="label" options={doctors.data?.map(d => ({ value: d.id, label: d.fullName }))} onChange={value => { setDoctorId(value); setDate(undefined); form.setFieldsValue({ date: undefined, time: undefined }); }} />}</Form.Item><Form.Item name="date" label="Día disponible" rules={[{ required: true, message: "Selecciona un día disponible" }]}><Select disabled={!effectiveDoctorId || slots.isLoading} loading={slots.isLoading} placeholder={effectiveDoctorId ? "Selecciona un día" : "Primero selecciona un doctor"} options={availableDays.map(day => ({ value: day.date, label: dateLabel(day.date) }))} onChange={value => { setDate(value); form.setFieldValue("time", undefined); }} /></Form.Item><Form.Item name="time" label="Hora disponible" rules={[{ required: true, message: "Selecciona una hora disponible" }]}><Select disabled={!date} placeholder={date ? "Selecciona una hora" : "Primero selecciona un día"} options={availableTimes.map(slot => ({ value: slot.startTime.slice(0, 5), label: slot.startTime.slice(0, 5) }))} /></Form.Item><Form.Item name="reason" label="Motivo"><Input.TextArea rows={2} /></Form.Item></Form></Modal></>;
}
