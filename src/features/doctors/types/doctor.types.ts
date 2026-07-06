export type DoctorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type DoctorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DoctorSpecialty = {
  id: string;
  name: string;
  description?: string | null;
};

export type Doctor = {
  id: string;
  tenantUserId: string;
  fullName: string;
  specialty?: string | null;
  specialties: DoctorSpecialty[];
  licenseNumber?: string | null;
  email?: string | null;
  phone?: string | null;
  status: DoctorStatus;

  verificationStatus: DoctorVerificationStatus;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  rejectionReason?: string | null;

  bio?: string | null;
  consultationPrice?: number | null;
  consultationDurationMinutes?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDoctorRequest = {
  tenantUserId: string;
  fullName: string;
  specialty?: string;
  specialtyIds?: string[];
  licenseNumber?: string;
  email?: string;
  phone?: string;
  bio?: string;
  consultationPrice?: number;
  consultationDurationMinutes?: number;
};

export type UpdateDoctorRequest = Partial<CreateDoctorRequest>;

export type RejectDoctorRequest = {
  reason: string;
};