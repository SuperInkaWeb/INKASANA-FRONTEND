import { api } from "../../../shared/api/api";
import type {
  CreateTenantUserRequest,
  TenantUser,
  TenantUserFilters,
  UpdateTenantUserRequest,
} from "../types/user.types";

const BASE_URL = "/api/tenant/users";

export async function getUsers(filters?: TenantUserFilters) {
  const response = await api.get<TenantUser[]>(BASE_URL, {
    params: {
      search: filters?.search || undefined,
      role: filters?.role || undefined,
      status: filters?.status || undefined,
    },
  });

  return response.data;
}

export async function createUser(payload: CreateTenantUserRequest) {
  const response = await api.post<TenantUser>(BASE_URL, payload);
  return response.data;
}

export async function updateUser(id: string, payload: UpdateTenantUserRequest) {
  const response = await api.patch<TenantUser>(`${BASE_URL}/${id}`, payload);
  return response.data;
}

export async function activateUser(id: string) {
  const response = await api.patch<TenantUser>(`${BASE_URL}/${id}/activate`);
  return response.data;
}

export async function suspendUser(id: string) {
  const response = await api.patch<TenantUser>(`${BASE_URL}/${id}/suspend`);
  return response.data;
}

export async function deactivateUser(id: string) {
  const response = await api.patch<TenantUser>(`${BASE_URL}/${id}/deactivate`);
  return response.data;
}