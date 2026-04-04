import api from '@/config/api';
import type { Escola } from '@/types/escola-types';

export const EscolasService = {
  getAll: () => api.get<Escola[]>('/escolas'),
  getById: (id: string) => api.get<Escola>(`/escolas/${id}`),
  create: (data: Omit<Escola, 'id'>) => api.post<Escola>('/escolas', data),
  update: (id: string, data: Partial<Escola>) => api.put<Escola>(`/escolas/${id}`, data),
  delete: (id: string) => api.delete(`/escolas/${id}`),
};
