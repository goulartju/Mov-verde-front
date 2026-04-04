import api from '@/config/api';
import type { Doacao } from '@/types/doacoe-types';

export const DoacoesService = {
  getAll: () => api.get<Doacao[]>('/doacoes'),
  getById: (id: string) => api.get<Doacao>(`/doacoes/${id}`),
  create: (data: Omit<Doacao, 'id'>) => api.post<Doacao>('/doacoes', data),
  update: (id: string, data: Partial<Doacao>) => api.put<Doacao>(`/doacoes/${id}`, data),
  delete: (id: string) => api.delete(`/doacoes/${id}`),
};
