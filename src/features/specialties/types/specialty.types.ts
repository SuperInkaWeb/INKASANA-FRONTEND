export type SpecialtyStatus = "ACTIVE" | "INACTIVE";

export type GlobalSpecialty = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: SpecialtyStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateGlobalSpecialtyRequest = {
  name: string;
  description?: string | null;
};

export type UpdateGlobalSpecialtyRequest = {
  name?: string | null;
  description?: string | null;
  status?: SpecialtyStatus | null;
};