import { api } from "../../../shared/api/api";
import type {
  CreateGlobalSpecialtyRequest,
  GlobalSpecialty,
  SpecialtyStatus,
  UpdateGlobalSpecialtyRequest,
} from "../types/specialty.types";

export async function getSpecialties(params?: {
  status?: SpecialtyStatus;
  search?: string;
}) {
  const response = await api.get<GlobalSpecialty[]>("/api/platform/specialties", {
    params,
  });

  return response.data;
}

export async function getActiveSpecialties() {
  const response = await api.get<GlobalSpecialty[]>(
    "/api/platform/specialties/active"
  );

  return response.data;
}

export async function createSpecialty(payload: CreateGlobalSpecialtyRequest) {
  const response = await api.post<GlobalSpecialty>(
    "/api/platform/specialties",
    payload
  );

  return response.data;
}

export async function updateSpecialty(
  id: string,
  payload: UpdateGlobalSpecialtyRequest
) {
  const response = await api.put<GlobalSpecialty>(
    `/api/platform/specialties/${id}`,
    payload
  );

  return response.data;
}

export async function activateSpecialty(id: string) {
  const response = await api.patch<GlobalSpecialty>(
    `/api/platform/specialties/${id}/activate`
  );

  return response.data;
}

export async function deactivateSpecialty(id: string) {
  const response = await api.patch<GlobalSpecialty>(
    `/api/platform/specialties/${id}/deactivate`
  );

  return response.data;
}