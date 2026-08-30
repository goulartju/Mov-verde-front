import HttpRequest from '@/config/requests';
import type { Calendario } from '@/types/calendario-types';

export const CalendariosService = {
  getAll: () => HttpRequest.get<Calendario[]>({ url: '/calendarios' }),
  getById: (id: string) => HttpRequest.get<Calendario>({ url: `/calendarios/${id}` }),
  create: (data: Omit<Calendario, 'id'>) => HttpRequest.post<Calendario>({ url: '/calendarios', body: data }),
  update: (id: string, data: Partial<Calendario>) => HttpRequest.put<Calendario>({ url: `/calendarios/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/calendarios/${id}` }),


};
