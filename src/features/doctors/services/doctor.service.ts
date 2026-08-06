import axios from "axios";
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

  uploadPhoto: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("access_token");

    // Usamos axios "puro" (no la instancia `api`) para esta petición,
    // porque `api` fuerza Content-Type: application/json por defecto y
    // eso rompería el "boundary" que el navegador necesita generar
    // automáticamente para multipart/form-data.
    const { data } = await axios.post<Doctor>(
      `${api.defaults.baseURL}${BASE_URL}/${id}/photo`,
      formData,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

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