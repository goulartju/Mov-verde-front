export interface Turma {
  id: string;
  nome: string;
  anoEscolar: string;
  escolaId: string;
  turno: string;
  calendarioId: string;
  representanteId?: string;
  representanteNome?: string;
  ativo: boolean;
}

export interface Representante {
  nomeUsuario: string;
  usuarioId: string;
}

export enum Turno {
  MANHA = "Manhã",
  TARDE = "Tarde",
  NOITE = "Noite",
}

export enum AnoSerie {
  PRIMEIRO = "Primeiro",
  SEGUNDO = "Segundo",
  TERCEIRO = "Terceiro",
  QUARTO = "Quarto",
  QUINTO = "Quinto",
  SEXTO = "Sexto",
  SETIMO = "Sétimo",
  OITAVO = "Oitavo",
  NONO = "Nono",
  DECIMO = "Décimo",
}