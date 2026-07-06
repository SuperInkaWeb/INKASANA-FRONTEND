import { api } from "../../../shared/api/api";
import type { UserRole } from "../../../app/store/auth.store";

export type AuthMeResponse = {
  sub: string;
  email: string | null;
  name: string | null;
  roles: UserRole[];
  authorities: string[];
  issuer: string;
  audience: string[];
  scopes: string;
};

export const authService = {
  me: async (): Promise<AuthMeResponse> => {
    const response = await api.get<AuthMeResponse>("/api/auth/me");
    return response.data;
  },
};