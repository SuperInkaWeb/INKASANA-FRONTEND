import { api } from "../../../shared/api/api";

export type TenantBranding = {
  id: string;
  clinicName: string;
  slogan?: string | null;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TenantBrandingRequest = {
  clinicName: string;
  slogan?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  onboardingCompleted?: boolean;
};

export const brandingService = {
  getBranding: async (): Promise<TenantBranding> => {
    const { data } = await api.get("/api/tenant/branding");
    return data;
  },

  saveBranding: async (
    payload: TenantBrandingRequest
  ): Promise<TenantBranding> => {
    const { data } = await api.post("/api/tenant/branding", payload);
    return data;
  },
};