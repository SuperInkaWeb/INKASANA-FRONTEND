import type { DaySlotsResponse } from "../../agenda/types/slot.types";
import { api } from "../../../shared/api/api";
import type {
   MarketplaceClinic,
  MarketplaceClinicDetail,
  MarketplaceClinicFilters,
  MarketplaceDoctor,
  MarketplaceDoctorDetail,
  MarketplaceDoctorFilters,
} from "../types/marketplace.types";

const BASE_URL = "/api/public/marketplace";

export async function getMarketplaceDoctors(filters?: MarketplaceDoctorFilters) {
  const response = await api.get<MarketplaceDoctor[]>(`${BASE_URL}/doctors`, {
    params: {
      search: filters?.search || undefined,
      city: filters?.city || undefined,
      country: filters?.country || undefined,
      minPrice: filters?.minPrice ?? undefined,
      maxPrice: filters?.maxPrice ?? undefined,
    },
  });

  return response.data;
}

export async function getMarketplaceDoctor(slug: string) {
  const response = await api.get<MarketplaceDoctorDetail>(
    `${BASE_URL}/doctors/${slug}`
  );

  return response.data;
}
export async function getMarketplaceClinics(filters?: MarketplaceClinicFilters) {
  const response = await api.get<MarketplaceClinic[]>(`${BASE_URL}/clinics`, {
    params: {
      search: filters?.search || undefined,
      city: filters?.city || undefined,
      country: filters?.country || undefined,
    },
  });

  return response.data;
}

export async function getMarketplaceClinic(slug: string) {
  const response = await api.get<MarketplaceClinicDetail>(
    `${BASE_URL}/clinics/${slug}`
  );

  return response.data;
}

export async function getMarketplaceClinicDoctors(slug: string) {
  const response = await api.get<MarketplaceDoctor[]>(
    `${BASE_URL}/clinics/${slug}/doctors`
  );

  return response.data;
}
export async function getMarketplaceDoctorSlots(
  doctorId: string,
  from: string,
  to?: string
) {
  const response = await api.get<DaySlotsResponse[]>(
    `${BASE_URL}/doctors/${doctorId}/slots`,
    {
      params: { from, to },
    }
  );
  return response.data;
}

export async function createMarketplaceAppointmentCheckout(
  doctorSlug: string,
  payload: { doctorId: string; date: string; time: string }
) {
  const response = await api.post<{ url: string }>(
    `${BASE_URL}/doctors/${encodeURIComponent(doctorSlug)}/appointment-checkout`,
    payload
  );
  return response.data;
}
