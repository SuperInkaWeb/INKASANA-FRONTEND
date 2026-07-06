import { api } from "../../../shared/api/api";
import type {
  CreateTenantUserRequest,
  TenantUser,
  TenantUserFilters,
  UpdateTenantUserRequest,
} from "../types/user.types";

const BASE_URL = "/api/tenant/users";

export const userService = {
  findAll: async (filters?: TenantUserFilters) => {
    const { data } = await api.get<TenantUser[]>(BASE_URL, {
      params: filters,
    });

    return data;
  },

  create: async (payload: CreateTenantUserRequest) => {
    const { data } = await api.post<TenantUser>(BASE_URL, payload);
    return data;
  },

  update: async (id: string, payload: UpdateTenantUserRequest) => {
    const { data } = await api.patch<TenantUser>(`${BASE_URL}/${id}`, payload);
    return data;
  },

  suspend: async (id: string) => {
    const { data } = await api.patch<TenantUser>(`${BASE_URL}/${id}/suspend`);
    return data;
  },

  activate: async (id: string) => {
    const { data } = await api.patch<TenantUser>(`${BASE_URL}/${id}/activate`);
    return data;
  },

  deactivate: async (id: string) => {
    const { data } = await api.patch<TenantUser>(`${BASE_URL}/${id}/deactivate`);
    return data;
  },
};