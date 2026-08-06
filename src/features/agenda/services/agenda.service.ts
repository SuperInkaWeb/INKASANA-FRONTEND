import { api } from "../../../shared/api/api";
import type {
  AvailabilityException,
  CreateAvailabilityExceptionRequest,
  CreateDoctorAvailabilityRequest,
  DoctorAvailability,
  UpdateAvailabilityExceptionRequest,
  UpdateDoctorAvailabilityRequest,
} from "../types/agenda.types";

const availabilityUrl = (doctorId: string) =>
  `/api/tenant/doctors/${doctorId}/availability`;

const exceptionsUrl = (doctorId: string) =>
  `/api/tenant/doctors/${doctorId}/availability-exceptions`;

export const agendaService = {
  // ---- Horario semanal recurrente ----

  findAvailability: async (doctorId: string) => {
    const { data } = await api.get<DoctorAvailability[]>(
      availabilityUrl(doctorId)
    );

    return data;
  },

  createAvailability: async (
    doctorId: string,
    payload: CreateDoctorAvailabilityRequest
  ) => {
    const { data } = await api.post<DoctorAvailability>(
      availabilityUrl(doctorId),
      payload
    );

    return data;
  },

  updateAvailability: async (
    doctorId: string,
    availabilityId: string,
    payload: UpdateDoctorAvailabilityRequest
  ) => {
    const { data } = await api.patch<DoctorAvailability>(
      `${availabilityUrl(doctorId)}/${availabilityId}`,
      payload
    );

    return data;
  },

  deleteAvailability: async (doctorId: string, availabilityId: string) => {
    await api.delete(`${availabilityUrl(doctorId)}/${availabilityId}`);
  },

  // ---- Excepciones puntuales (feriados, vacaciones, bloques extra) ----

  findExceptions: async (
    doctorId: string,
    params?: { from?: string; to?: string }
  ) => {
    const { data } = await api.get<AvailabilityException[]>(
      exceptionsUrl(doctorId),
      { params }
    );

    return data;
  },

  createException: async (
    doctorId: string,
    payload: CreateAvailabilityExceptionRequest
  ) => {
    const { data } = await api.post<AvailabilityException>(
      exceptionsUrl(doctorId),
      payload
    );

    return data;
  },

  updateException: async (
    doctorId: string,
    exceptionId: string,
    payload: UpdateAvailabilityExceptionRequest
  ) => {
    const { data } = await api.patch<AvailabilityException>(
      `${exceptionsUrl(doctorId)}/${exceptionId}`,
      payload
    );

    return data;
  },

  deleteException: async (doctorId: string, exceptionId: string) => {
    await api.delete(`${exceptionsUrl(doctorId)}/${exceptionId}`);
  },
};
