import HttpRequest from '@/config/requests';
import type { Escola } from '@/types/escola-types';

export const EscolasService = {
  getAll: () => HttpRequest.get<Escola[]>({ url: '/escola' }),

  getById: (id: string) => HttpRequest.get<Escola>({ url: `/escola/${id}` }),
  create: (data: Omit<Escola, 'id'>) => HttpRequest.post<Escola>({ url: '/escola', body: data }),
  update: (id: string, data: Partial<Escola>) => HttpRequest.put<Escola>({ url: `/escola/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/escola/${id}` }),
};
