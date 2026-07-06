import { create } from "zustand";

export type UserRole =
  | "OWNER"
  | "ADMIN"
  | "DOCTOR"
  | "THERAPIST"
  | "RECEPTIONIST"
  | "PATIENT";

export type AuthScope = "PLATFORM" | "TENANT";

type AuthState = {
  token: string | null;
  roles: UserRole[];
  role: UserRole | null;
  userId: string | null;
  orgId: string | null;
  schema: string | null;
  scope: AuthScope | null;
  isAuthenticated: boolean;

  setAuthData: (data: {
    token: string;
    role?: UserRole | null;
    roles?: UserRole[];
    userId?: string | null;
    orgId?: string | null;
    schema?: string | null;
    scope?: AuthScope | null;
  }) => void;

  setToken: (token: string) => void;
  setRoles: (roles: UserRole[]) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("access_token"),
  roles: JSON.parse(localStorage.getItem("roles") || "[]"),
  role: (localStorage.getItem("role") as UserRole) || null,
  userId: localStorage.getItem("user_id"),
  orgId: localStorage.getItem("org_id"),
  schema: localStorage.getItem("schema"),
  scope: (localStorage.getItem("scope") as AuthScope) || null,
  isAuthenticated: Boolean(localStorage.getItem("access_token")),

  setAuthData: ({ token, role, roles, userId, orgId, schema, scope }) => {
    localStorage.setItem("access_token", token);

    if (role) localStorage.setItem("role", role);
    if (roles) localStorage.setItem("roles", JSON.stringify(roles));
    if (userId) localStorage.setItem("user_id", userId);
    if (orgId) localStorage.setItem("org_id", orgId);
    if (schema) localStorage.setItem("schema", schema);
    if (scope) localStorage.setItem("scope", scope);

    set({
      token,
      role: role || null,
      roles: roles || (role ? [role] : []),
      userId: userId || null,
      orgId: orgId || null,
      schema: schema || null,
      scope: scope || null,
      isAuthenticated: true,
    });
  },

  setToken: (token) => {
    localStorage.setItem("access_token", token);

    set({
      token,
      isAuthenticated: true,
    });
  },

  setRoles: (roles) => {
    localStorage.setItem("roles", JSON.stringify(roles));

    set({
      roles,
      role: roles[0] || null,
    });

    if (roles[0]) {
      localStorage.setItem("role", roles[0]);
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("roles");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("org_id");
    localStorage.removeItem("schema");
    localStorage.removeItem("scope");

    set({
      token: null,
      roles: [],
      role: null,
      userId: null,
      orgId: null,
      schema: null,
      scope: null,
      isAuthenticated: false,
    });
  },
}));