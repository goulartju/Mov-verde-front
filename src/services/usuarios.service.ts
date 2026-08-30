
import HttpRequest from '@/config/requests';
import type { Usuario, UsuarioPayload } from '@/types/usuario-types';

export const UsuariosService = {
  getAll: () => HttpRequest.get<Usuario[]>({ url: '/usuarios' }),
  getById: (id: string) => HttpRequest.get<Usuario>({ url: `/usuarios/${id}` }),
  create: (data: UsuarioPayload) => HttpRequest.post<Usuario>({ url: '/usuarios', body: data }),
  update: (id: string, data: Partial<Usuario>) => HttpRequest.put<Usuario>({ url: `/usuarios/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/usuarios/${id}` }),
};
