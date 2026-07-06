import { api } from "../../../shared/api/api";

export async function auth0TenantLogin(
  slug: string,
  auth0Token: string,
  email: string,
  auth0Id: string
) {
  const response = await api.post(
    "/api/auth/auth0-tenant-login",
    {
      slug,
      email,
      auth0Id,
    },
    {
      headers: {
        Authorization: `Bearer ${auth0Token}`,
      },
    }
  );

  return response.data;
}