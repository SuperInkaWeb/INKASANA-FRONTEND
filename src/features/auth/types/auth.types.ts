export type UserRole =
  | "OWNER"
  | "ADMIN"
  | "DOCTOR"
  | "THERAPIST"
  | "RECEPTIONIST"
  | "PATIENT";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  roles: UserRole[];
}