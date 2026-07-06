import { api } from "../../../shared/api/api";

export type CreateOrganizationRequest = {
  name: string;
  type: "CLINIC" | "HOSPITAL";
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
};

export type OrganizationResponse = {
  id: string;
  name: string;
  slug: string;
  schemaName: string;
  type: "CLINIC" | "HOSPITAL";
  status: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  schemaReady: boolean;
};

export async function createOrganization(data: CreateOrganizationRequest) {
  const response = await api.post<OrganizationResponse>(
    "/api/platform/organizations",
    data
  );

  return response.data;
}