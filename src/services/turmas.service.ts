import api from '@/config/api';
import type { Turma } from '@/types/turma-types';

export const TurmasService = {
  getAll: () => api.get<Turma[]>('/turmas'),
  getById: (id: string) => api.get<Turma>(`/turmas/${id}`),
  create: (data: Omit<Turma, 'id'>) => api.post<Turma>('/turmas', data),
  update: (id: string, data: Partial<Turma>) => api.put<Turma>(`/turmas/${id}`, data),
  delete: (id: string) => api.delete(`/turmas/${id}`),
};
