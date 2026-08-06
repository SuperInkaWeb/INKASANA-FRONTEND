import { api } from "../../../shared/api/api";
import type { DaySlotsResponse } from "../types/slot.types";

const slotsUrl = (doctorId: string) =>
  `/api/tenant/doctors/${doctorId}/slots`;

export const slotService = {
  // "to" es opcional: si no se envía, solo trae los slots de "from".
  findSlots: async (doctorId: string, from: string, to?: string) => {
    const { data } = await api.get<DaySlotsResponse[]>(slotsUrl(doctorId), {
      params: { from, to },
    });

    return data;
  },
  
};

