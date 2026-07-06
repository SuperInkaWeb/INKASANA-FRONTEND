export type PatientStatus = "ACTIVE" | "INACTIVE";

export type PatientGender = "MALE" | "FEMALE" | "OTHER";

export type Patient = {
  id: string;
  fullName: string;
  identification?: string | null;
  birthDate?: string | null;
  gender?: PatientGender | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  status: PatientStatus;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePatientRequest = {
  fullName: string;
  identification?: string;
  birthDate?: string;
  gender?: PatientGender;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  notes?: string;
};

export type UpdatePatientRequest = Partial<CreatePatientRequest>;