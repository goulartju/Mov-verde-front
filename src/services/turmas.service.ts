import HttpRequest from '@/config/requests';
import type { Turma } from '@/types/turma-types';

export const TurmasService = {
  getAll: () => HttpRequest.get<Turma[]>({ url: '/turmas' }),
  getById: (id: string) => HttpRequest.get<Turma>({ url: `/turmas/${id}` }),
  create: (data: Omit<Turma, 'id'>) => HttpRequest.post<Turma>({ url: '/turmas', body: data }),
  update: (id: string, data: Partial<Turma>) => HttpRequest.put<Turma>({ url: `/turmas/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/turmas/${id}` }),
};
