import HttpRequest from '@/config/requests';
import type {
  AlunoRankingItem,
  AlunoRankingSemanalItem,
  EscolaRankingItem,
  TurmaAlunoRankingItem,
  TurmaRankingItem,
} from '@/types/ranking-types';

export const RankingsService = {
  getRankingAlunos: (escolaId?: string) =>
    HttpRequest.get<AlunoRankingItem[]>({
      url: '/rankings/quadro-alunos',
      params: escolaId ? { escolaId } : undefined,
    }),

  getRankingSemanalAlunos: (escolaId?: string) =>
    HttpRequest.get<AlunoRankingSemanalItem[]>({
      url: '/rankings/semana-alunos',
      params: escolaId ? { escolaId } : undefined,
    }),

  getRankingTurmas: (escolaId?: string) =>
    HttpRequest.get<TurmaRankingItem[]>({
      url: '/rankings/quadro-turmas',
      params: escolaId ? { escolaId } : undefined,
    }),

  getRankingEscolas: () =>
    HttpRequest.get<EscolaRankingItem[]>({ url: '/rankings/quadro-escolas' }),

  getRankingTurmaAlunos: (turmaId: string) =>
    HttpRequest.get<TurmaAlunoRankingItem[]>({
      url: `/rankings/turmas/${turmaId}/alunos`,
    }),
};
