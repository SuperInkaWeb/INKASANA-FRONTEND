// Slot puntual dentro de un día (ej: 09:00 - 09:30).
export type SlotResponse = {
  startTime: string; // "HH:mm:ss"
  endTime: string; // "HH:mm:ss"
  // false si el slot ya pasó (para el día de hoy). No implica que esté
  // reservado, ya que aún no existe el módulo de Citas en el backend.
  available: boolean;
};

// Slots generados para una fecha específica.
export type DaySlotsResponse = {
  date: string; // "YYYY-MM-DD"
  slots: SlotResponse[];
};
