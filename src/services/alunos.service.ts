import api from '@/config/api';
import type { Aluno } from '@/types/aluno-types';

export const AlunosService = {
  getAll: () => api.get<Aluno[]>('/alunos'),
  getById: (id: string) => api.get<Aluno>(`/alunos/${id}`),
  create: (data: Omit<Aluno, 'id'>) => api.post<Aluno>('/alunos', data),
  update: (id: string, data: Partial<Aluno>) => api.put<Aluno>(`/alunos/${id}`, data),
  delete: (id: string) => api.delete(`/alunos/${id}`),
};
