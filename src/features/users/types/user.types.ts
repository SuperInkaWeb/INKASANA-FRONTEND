export type TenantUserRole =
  | "OWNER"
  | "ADMIN"
  | "DOCTOR"
  | "THERAPIST"
  | "RECEPTIONIST"
  | "PATIENT";

export type TenantUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type TenantUser = {
  id: string;
  auth0Id?: string | null;
  email: string;
  fullName: string;
  phone?: string | null;
  role: TenantUserRole;
  status: TenantUserStatus;
  profileImageUrl?: string | null;
  lastLogin?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TenantUserFilters = {
  search?: string;
  role?: TenantUserRole;
  status?: TenantUserStatus;
};

export type CreateTenantUserRequest = {
  auth0Id?: string | null;
  email: string;
  fullName: string;
  phone?: string | null;
  role: TenantUserRole;
};

export type UpdateTenantUserRequest = {
  fullName: string;
  phone?: string | null;
  role: TenantUserRole;
  profileImageUrl?: string | null;
};