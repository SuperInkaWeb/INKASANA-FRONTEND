import { api } from "../../../shared/api/api";
import type {
  CreateOrganizationRequest,
  OrganizationResponse,
} from "../types/organization.types";

export async function createOrganization(
  payload: CreateOrganizationRequest
): Promise<OrganizationResponse> {
  const { data } = await api.post<OrganizationResponse>(
    "/api/platform/organizations",
    payload
  );

  return data;
}