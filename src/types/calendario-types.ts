export interface Calendario {
  id: string;
  ano: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

export interface CalendarioPayload {
  id?: string;
  ano: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  escolaId: string;
}