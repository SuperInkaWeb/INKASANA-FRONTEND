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
  availableDays?: string[];
  availableStartTime?: string | null;
  availableEndTime?: string | null;
  specialties?: string[];
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
  availableDays?: string[];
  availableStartTime?: string | null;
  availableEndTime?: string | null;
  specialties?: string[];
};

export type MarketplaceDoctorFilters = {
  search?: string;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
};
export type MarketplaceClinic = {
  id: string;
  organizationId?: string | null;
  displayName: string;
  slug: string;
  headline?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
  phone?: string | null;
  profileImageUrl?: string | null;
};

export type MarketplaceClinicDetail = {
  id: string;
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
};

export type MarketplaceClinicFilters = {
  search?: string;
  city?: string;
  country?: string;
};
