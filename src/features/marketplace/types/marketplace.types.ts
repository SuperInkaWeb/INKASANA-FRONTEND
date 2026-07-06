export type MarketplaceDoctor = {
  id: string;
  doctorId?: string | null;
  displayName: string;
  slug: string;
  headline?: string | null;
  city?: string | null;
  country?: string | null;
  profileImageUrl?: string | null;
  consultationPrice?: number | null;
  consultationDurationMinutes?: number | null;
};

export type MarketplaceDoctorDetail = {
  id: string;
  doctorId?: string | null;
  displayName: string;
  slug: string;
  headline?: string | null;
  description?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  profileImageUrl?: string | null;
  coverImageUrl?: string | null;
  consultationPrice?: number | null;
  consultationDurationMinutes?: number | null;
};

export type MarketplaceDoctorFilters = {
  search?: string;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
};