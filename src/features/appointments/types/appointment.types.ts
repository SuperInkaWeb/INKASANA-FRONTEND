export type AppointmentStatus = "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
export interface AppointmentSummary { confirmedAppointments: number; }
export interface Appointment { id: string; patientId: string; patientName: string; doctorId: string; doctorName: string; tenantId: string; date: string; time: string; status: AppointmentStatus; reason?: string; price?: number; }
export interface CreateAppointmentRequest { patientId: string; doctorId: string; date: string; time: string; reason?: string; }
