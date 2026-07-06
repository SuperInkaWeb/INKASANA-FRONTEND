import { api } from "../../../shared/api/api";
import type {
  CreateDoctorRequest,
  Doctor,
  DoctorStatus,
  RejectDoctorRequest,
  UpdateDoctorRequest,
} from "../types/doctor.types";

const BASE_URL = "/api/tenant/doctors";

export const doctorService = {
  findAll: async (params?: { status?: DoctorStatus; search?: string }) => {
    const { data } = await api.get<Doctor[]>(BASE_URL, {
      params,
    });

    return data;
  },

  findById: async (id: string) => {
    const { data } = await api.get<Doctor>(`${BASE_URL}/${id}`);
    return data;
  },

  create: async (payload: CreateDoctorRequest) => {
    const { data } = await api.post<Doctor>(BASE_URL, payload);
    return data;
  },

  update: async (id: string, payload: UpdateDoctorRequest) => {
    const { data } = await api.patch<Doctor>(`${BASE_URL}/${id}`, payload);
    return data;
  },

  activate: async (id: string) => {
    const { data } = await api.patch<Doctor>(`${BASE_URL}/${id}/activate`);
    return data;
  },

  deactivate: async (id: string) => {
    const { data } = await api.patch<Doctor>(`${BASE_URL}/${id}/deactivate`);
    return data;
  },

  approve: async (id: string) => {
    const { data } = await api.patch<Doctor>(`${BASE_URL}/${id}/approve`);
    return data;
  },

  reject: async (id: string, reason: string) => {
    const payload: RejectDoctorRequest = {
      reason,
    };

    const { data } = await api.patch<Doctor>(
      `${BASE_URL}/${id}/reject`,
      payload
    );

    return data;
  },
};