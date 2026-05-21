export interface Usuario {
  id: string;
  nome: string;
  permissao: number;
  dataNascimento: string;
  email?: string;
  cargo: string;
  ativo: boolean;
}

export interface UsuarioPayload {
  nome: string;
  dataNascimento: string;
  email: string;
  permissao: number;
  cargo: string;
}

export enum UsuarioPermissao {
  Visualizador = 1,
  Editor = 2,
  Administrador = 3,
}