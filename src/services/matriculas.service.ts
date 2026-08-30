import HttpRequest from '@/config/requests';
import type { Matricula } from '@/types/matricula-types';

export const MatriculasService = {
  getAll: () => HttpRequest.get<Matricula[]>({ url: '/matriculas' }),
};
