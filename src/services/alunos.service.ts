import HttpRequest from '@/config/requests';
import type { Aluno } from '@/types/aluno-types';

export const AlunosService = {
  getAll: () => HttpRequest.get<Aluno[]>({ url: '/alunos' }),
  getById: (id: string) => HttpRequest.get<Aluno>({ url: `/alunos/${id}` }),
  create: (data: Omit<Aluno, 'id'>) => HttpRequest.post<Aluno>({ url: '/alunos', body: data }),
  update: (id: string, data: Partial<Aluno>) => HttpRequest.put<Aluno>({ url: `/alunos/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/alunos/${id}` }),
};
