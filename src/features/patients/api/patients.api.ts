import { api } from "../../../shared/api/api";
import type {
  CreatePatientRequest,
  Patient,
  PatientStatus,
  UpdatePatientRequest,
} from "../types/patient.types";

const BASE_URL = "/api/tenant/patients";

export async function getPatients(filters?: {
  search?: string;
  status?: PatientStatus;
}) {
  const response = await api.get<Patient[]>(BASE_URL, {
    params: {
      search: filters?.search || undefined,
      status: filters?.status || undefined,
    },
  });

  return response.data;
}

export async function getPatientById(id: string) {
  const response = await api.get<Patient>(`${BASE_URL}/${id}`);
  return response.data;
}

export async function getPatientProfile(id: string) {
  const response = await api.get<Patient>(`${BASE_URL}/${id}/profile`);
  return response.data;
}

export async function createPatient(payload: CreatePatientRequest) {
  const response = await api.post<Patient>(BASE_URL, payload);
  return response.data;
}

export async function updatePatient(
  id: string,
  payload: UpdatePatientRequest
) {
  const response = await api.patch<Patient>(`${BASE_URL}/${id}`, payload);
  return response.data;
}

export async function activatePatient(id: string) {
  const response = await api.patch<Patient>(`${BASE_URL}/${id}/activate`);
  return response.data;
}

export async function deactivatePatient(id: string) {
  const response = await api.patch<Patient>(`${BASE_URL}/${id}/deactivate`);
  return response.data;
}