export interface Usuario {
  id: string;
  nome: string;
  permissao: string;
  dataNascimento: string;
  email?: string;
  senhaHash?: string;
  cargo: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}