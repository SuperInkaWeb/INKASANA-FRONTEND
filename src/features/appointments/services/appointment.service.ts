import { api } from "../../../shared/api/api";
import type { Appointment, AppointmentStatus, CreateAppointmentRequest } from "../types/appointment.types";
const base = "/api/tenant/appointments";
export const appointmentService = {
  findAll: (params?: { patientId?: string; doctorId?: string; date?: string }) => api.get<Appointment[]>(base, { params }).then((r) => r.data),
  create: (payload: CreateAppointmentRequest) => api.post<Appointment>(base, payload).then((r) => r.data),
  cancel: (id: string) => api.patch<Appointment>(`${base}/${id}/cancel`).then((r) => r.data),
  changeStatus: (id: string, status: AppointmentStatus) => api.patch<Appointment>(`${base}/${id}/status`, { status }).then((r) => r.data),
}; 
