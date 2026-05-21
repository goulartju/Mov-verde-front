import HttpRequest from '@/config/requests';
import type { Doacao, DoacaoPayload, DoacoesFilter, DoacoesUpdatePayload } from '@/types/doacoes-types';

export const DoacoesService = {
  getAll: () => HttpRequest.get<Doacao[]>({ url: '/Doacoes' }),
  getByFilter: (filter: DoacoesFilter) => HttpRequest.get<Doacao[]>({ url: '/Doacoes/filter', params: { ...filter } }),
  getById: (id: string) => HttpRequest.get<Doacao>({ url: `/Doacoes/${id}` }),
  createByFilter: (filter: DoacoesFilter) => HttpRequest.post<Doacao[]>({ url: '/Doacoes/filter', body: filter }),
  create: (data: DoacaoPayload[]) => HttpRequest.post<Doacao[]>({ url: '/Doacoes/lote', body: data }),
  update: (data: DoacoesUpdatePayload) => HttpRequest.put<Doacao[]>({ url: '/Doacoes/lote', body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/Doacoes/${id}` }),
};
