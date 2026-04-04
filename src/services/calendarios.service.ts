import api from '@/config/api';
import type { Calendario } from '@/types/calendario-types';

export const CalendariosService = {
  getAll: () => api.get<Calendario[]>('/Calendarios'),
  getById: (id: string) => api.get<Calendario>(`/Calendarios/${id}`),
  create: (data: Omit<Calendario, 'id'>) => api.post<Calendario>('/Calendarios', data),
  update: (id: string, data: Partial<Calendario>) => api.put<Calendario>(`/Calendarios/${id}`, data),
  delete: (id: string) => api.delete(`/Calendarios/${id}`),

  logAll: async () => {
    const { data } = await CalendariosService.getAll();
    console.log('Calendários:', data);
  },
};
