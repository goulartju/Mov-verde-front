import HttpRequest from '@/config/requests';
import type { Calendario } from '@/types/calendario-types';

export const CalendariosService = {
  getAll: () => HttpRequest.get<Calendario[]>({ url: '/Calendarios' }),
  getById: (id: string) => HttpRequest.get<Calendario>({ url: `/Calendarios/${id}` }),
  create: (data: Omit<Calendario, 'id'>) => HttpRequest.post<Calendario>({ url: '/Calendarios', body: data }),
  update: (id: string, data: Partial<Calendario>) => HttpRequest.put<Calendario>({ url: `/Calendarios/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/Calendarios/${id}` }),


};
