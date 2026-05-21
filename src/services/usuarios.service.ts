
import HttpRequest from '@/config/requests';
import type { Usuario, UsuarioPayload } from '@/types/usuario-types';

export const UsuariosService = {
  getAll: () => HttpRequest.get<Usuario[]>({ url: '/Usuarios' }),
  getById: (id: string) => HttpRequest.get<Usuario>({ url: `/Usuarios/${id}` }),
  create: (data: UsuarioPayload) => HttpRequest.post<Usuario>({ url: '/Usuarios', body: data }),
  update: (id: string, data: Partial<Usuario>) => HttpRequest.put<Usuario>({ url: `/Usuarios/${id}`, body: data }),
  delete: (id: string) => HttpRequest.delete({ url: `/Usuarios/${id}` }),
};
