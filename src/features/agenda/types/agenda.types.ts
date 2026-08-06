export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export const DAY_OF_WEEK_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

// ---- Disponibilidad semanal recurrente (doctor_availability) ----

export type DoctorAvailability = {
  id: string;
  doctorId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateDoctorAvailabilityRequest = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  active?: boolean;
};

export type UpdateDoctorAvailabilityRequest =
  Partial<CreateDoctorAvailabilityRequest>;

// ---- Excepciones puntuales (availability_exceptions) ----

export type AvailabilityExceptionType = "UNAVAILABLE" | "EXTRA";

export const AVAILABILITY_EXCEPTION_TYPE_LABELS: Record<
  AvailabilityExceptionType,
  string
> = {
  UNAVAILABLE: "No disponible (día bloqueado)",
  EXTRA: "Bloque extra",
};

export type AvailabilityException = {
  id: string;
  doctorId: string;
  exceptionDate: string; // "YYYY-MM-DD"
  type: AvailabilityExceptionType;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAvailabilityExceptionRequest = {
  exceptionDate: string;
  type: AvailabilityExceptionType;
  // Obligatorios solo si type = EXTRA. Si type = UNAVAILABLE deben venir null.
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
};

export type UpdateAvailabilityExceptionRequest =
  Partial<CreateAvailabilityExceptionRequest>;
