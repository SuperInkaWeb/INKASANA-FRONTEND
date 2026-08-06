import axios from "axios";
import { api } from "../../../shared/api/api";

export type MarketplaceOrganizationProfile = {
  id: string;
  profileType: "DOCTOR" | "CLINIC";
  doctorId?: string | null;
  organizationId?: string | null;
  displayName: string;
  slug: string;
  headline?: string | null;
  description?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  carouselImageUrl1?: string | null;
  carouselImageUrl2?: string | null;
  pageColor?: string | null;
  buttonColor?: string | null;
  subscriptionColor?: string | null;
  appearanceConfig?: string | null;
  consultationPrice?: number | null;
  consultationDurationMinutes?: number | null;
  isPublished: boolean;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN" | "ARCHIVED";
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateMarketplaceOrganizationProfileRequest = {
  displayName?: string;
  headline?: string;
  description?: string;
  city?: string;
  country?: string;
  address?: string;
  phone?: string;
  email?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  carouselImageUrl1?: string;
  carouselImageUrl2?: string;
  pageColor?: string;
  buttonColor?: string;
  subscriptionColor?: string;
  appearanceConfig?: string;
};

const BASE_URL = "/api/tenant/marketplace/profiles/organization";

export const clinicProfileService = {
  getMyClinicProfile: async (): Promise<MarketplaceOrganizationProfile> => {
    const { data } = await api.get<MarketplaceOrganizationProfile>(BASE_URL);
    return data;
  },

  updateMyClinicProfile: async (
    payload: UpdateMarketplaceOrganizationProfileRequest
  ): Promise<MarketplaceOrganizationProfile> => {
    const { data } = await api.patch<MarketplaceOrganizationProfile>(
      BASE_URL,
      payload
    );
    return data;
  },

  uploadMyClinicImage: async (
    imageType: "profile" | "cover" | "carousel-1" | "carousel-2",
    file: File
  ): Promise<MarketplaceOrganizationProfile> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("access_token");

    // Usamos axios "puro" (no la instancia `api`) para esta petición,
    // porque `api` fuerza Content-Type: application/json por defecto y
    // eso rompería el "boundary" que el navegador necesita generar
    // automáticamente para multipart/form-data. Mismo patrón que
    // doctorService.uploadPhoto.
    const { data } = await axios.post<MarketplaceOrganizationProfile>(
      `${api.defaults.baseURL}${BASE_URL}/images/${imageType}`,
      formData,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return data;
  },
};
