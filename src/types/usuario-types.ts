export interface Usuario {
  id: string;
  nome: string;
  permissao: number;
  email?: string;
  cargo: string;
  ativo: boolean;
}

export interface UsuarioPayload {
  nome: string;
  email: string;
  permissao: number;
  cargo: string;
}

export enum UsuarioPermissao {
  Visualizador = 0,
  Editor = 1,
  Administrador = 2,
}

export const UsuarioPermissaoLabel: Record<UsuarioPermissao, string> = {
  [UsuarioPermissao.Visualizador]: 'Visualizador',
  [UsuarioPermissao.Editor]: 'Editor',
  [UsuarioPermissao.Administrador]: 'Administrador',
};

export const getPermissaoLabel = (permissao?: number | null): string => {
  if (permissao === UsuarioPermissao.Visualizador) return 'Visualizador';
  if (permissao === UsuarioPermissao.Editor) return 'Editor';
  if (permissao === UsuarioPermissao.Administrador) return 'Administrador';
  return '—';
};