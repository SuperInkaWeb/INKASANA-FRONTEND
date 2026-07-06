export type OrganizationType = "CLINIC" | "HOSPITAL" | "MEDICAL_CENTER";

export type OrganizationStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE";

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  type: OrganizationType;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  ownerEmail: string;
  ownerFullName: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
  schemaName: string;
  type: OrganizationType;
  status: OrganizationStatus;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  schemaReady: boolean;
  schemaReadyAt?: string;
  provisioningError?: string;
  createdAt: string;
  updatedAt: string;
}