import HttpRequest from '@/config/requests';
import type { Turma } from '@/types/turma-types';

export const TurmasService = {
  getAll: () => HttpRequest.get<Turma[]>({ url: '/Turmas' }),
  getById: (id: string) => HttpRequest.get<Turma>({ url: `/Turmas/${id}` }),
  create: (data: Omit<Turma, 'id'>) => HttpRequest.post<Turma>({ url: '/Turmas', body: data }),
  update: (id: string, data: Partial<Turma>) => HttpRequest.put<Turma>({ url: `/Turmas/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/Turmas/${id}` }),
};
