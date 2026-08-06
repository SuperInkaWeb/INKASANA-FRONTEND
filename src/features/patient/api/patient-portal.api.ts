import { api } from "../../../shared/api/api";
import type { PatientAppointment, PatientPortalProfile } from "../types/patient-portal.types";

const base = "/api/public/patient-portal";

export const patientPortalApi = {
  login: (auth0Token: string, email: string, auth0Id: string) =>
    api.post("/api/auth/patient-login", { email, auth0Id }, { headers: { Authorization: `Bearer ${auth0Token}` } }).then((r) => r.data),
  getProfile: () => api.get<PatientPortalProfile>(`${base}/me`).then((r) => r.data),
  updateProfile: (payload: Partial<PatientPortalProfile>) => api.patch<PatientPortalProfile>(`${base}/me`, payload).then((r) => r.data),
  uploadAvatar: (file: File) => {
    const data = new FormData(); data.append("file", file);
    return api.post<PatientPortalProfile>(`${base}/me/avatar`, data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
  },
  appointments: () => api.get<PatientAppointment[]>(`${base}/appointments`).then((r) => r.data),
};
