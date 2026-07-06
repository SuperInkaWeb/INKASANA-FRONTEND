import { api } from "../../../shared/api/api";
import type {
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