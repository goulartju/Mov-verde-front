import api from '@/config/api';
import type { Usuario } from '@/types/usuario-types';

export const UsuariosService = {
  getAll: () => api.get<Usuario[]>('/usuarios'),
  getById: (id: string) => api.get<Usuario>(`/usuarios/${id}`),
  create: (data: Omit<Usuario, 'id'>) => api.post<Usuario>('/usuarios', data),
  update: (id: string, data: Partial<Usuario>) => api.put<Usuario>(`/usuarios/${id}`, data),
  delete: (id: string) => api.delete(`/usuarios/${id}`),
};
