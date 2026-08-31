import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, Award, Users } from "lucide-react";
import { RankingsService } from "@/services/rankings.service";
import type { TurmaAlunoRankingItem } from "@/types/ranking-types";
import { Medalhas } from "@/types/ranking-types";

const normalizeMedalName = (value?: string) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

const getMedalhaByTotal = (total: number) => {
  const medalha = [...Medalhas].reverse().find((item) => total >= item.totalNecessario);
  return medalha ?? Medalhas[0];
};

const getMedalhaByName = (nome?: string) => {
  const nomeNormalizado = normalizeMedalName(nome);

  if (!nomeNormalizado) {
    return undefined;
  }

  return Medalhas.find((item) => normalizeMedalName(item.nome) === nomeNormalizado);
};

const getMedalhaByNameOrTotal = (nome?: string | null, total?: number) => {
  const nomeValido = typeof nome === "string" ? nome.trim() : "";

  if (nomeValido) {
    const medalhaPeloNome = getMedalhaByName(nomeValido);

    if (medalhaPeloNome) {
      return medalhaPeloNome;
    }
  }

  if (typeof total === "number") {
    return getMedalhaByTotal(total);
  }

  return getMedalhaByTotal(0);
};

const getMedalhaImage = (nome?: string | null, total?: number) => {
  const nomeValido = typeof nome === "string" ? nome.trim() : "";

  if (!nomeValido) {
    return undefined;
  }

  return getMedalhaByNameOrTotal(nomeValido, total).imagem;
};

export function TurmaDetalhesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { turmaId } = useParams();
  const [detalhes, setDetalhes] = useState<TurmaAlunoRankingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [turmaNome, setTurmaNome] = useState("Turma");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nomeParam = params.get("nome");

    if (nomeParam) {
      setTurmaNome(nomeParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (!turmaId) {
      return;
    }

    const loadDetalhes = async () => {
      setLoading(true);

      try {
        const dados = await RankingsService.getRankingTurmaAlunos(turmaId);
        setDetalhes(dados ?? []);
      } catch (error) {
        console.error("Erro ao carregar alunos da turma:", error);
        setDetalhes([]);
      } finally {
        setLoading(false);
      }
    };

    void loadDetalhes();
  }, [turmaId]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Detalhes da turma</p>
          <h1 className="text-2xl font-bold text-slate-800">{turmaNome}</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/rankings?tab=turmas")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para rankings
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-700">
          <Award className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold">Alunos da turma</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="ml-3">Carregando alunos da turma...</span>
          </div>
        ) : detalhes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
            <Users className="mb-3 h-10 w-10 opacity-50" />
            <p>Nenhum aluno encontrado para esta turma.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {detalhes.map((aluno) => {
              const medalha = getMedalhaByNameOrTotal(aluno.medalha, aluno.total);
              const medalhaLabel = aluno.medalha?.trim() ? aluno.medalha : medalha.nome;
              const mostrarMedalha = Boolean(aluno.medalha && aluno.medalha.trim());

              return (
                <div
                  key={`${aluno.nome}-${aluno.posicao}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-blue-50 p-4 mb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                      {aluno.posicao}
                    </div>
                      {mostrarMedalha && (
                        <img
                          src={getMedalhaImage(aluno.medalha, aluno.total)}
                          alt={medalhaLabel}
                          className="h-13 w-13 rounded-full border border-gray-200 object-cover"
                        />  
                      )}

                    <div>
                      <p className="text-lg font-semibold">{aluno.nome}</p>
                      <span className="text-lg font-semibold text-blue-500">{medalhaLabel}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl  font-bold text-blue-600">{aluno.total.toLocaleString("pt-BR")}</p>
                    <p className="text-sm text-blue-500">
                      {aluno.quantidadeTampinhas} tampinhas • {aluno.quantidadeLacres} lacres
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
