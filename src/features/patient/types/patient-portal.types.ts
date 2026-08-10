export type PatientPortalProfile = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  dni?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
};

export type PatientAppointment = {
  id: string;
  doctorName: string;
  clinicName?: string | null;
  date: string;
  time: string;
  status: string;
  reason?: string | null;
};
