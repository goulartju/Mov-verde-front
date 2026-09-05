import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { RankingsService } from "@/services/rankings.service";
import type {
  AlunoRankingItem,
  EscolaRankingItem,
  TurmaRankingItem
} from "@/types/ranking-types";
import { Medalhas } from "@/types/ranking-types";
import { Award, Medal, Trophy, Users } from "lucide-react";


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

  return Medalhas.find(
    (item) => normalizeMedalName(item.nome) === nomeNormalizado,
  );
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

const getMedalIcon = (position: number) => {
  if (position === 0) return <Medal className="h-6 w-6 text-yellow-700" />;
  if (position === 1) return <Medal className="h-6 w-6 text-gray-600" />;
  if (position === 2) return <Medal className="h-6 w-6 text-orange-700" />;
  return null;
};

const getRankingBadge = (position: number) => {
  if (position === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
  if (position === 1) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
  if (position === 2) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
  return "bg-gray-100 text-gray-800";
};

const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const asGuid = (value?: string) => (value && GUID_REGEX.test(value) ? value : undefined);

const getSchoolKey = (item: { id?: string; escolaId?: string; nome: string }) =>
  item.escolaId || item.id || item.nome;

const getTurmaKey = (item: { id?: string; turmaId?: string; nome: string }) =>
  item.turmaId || item.id || item.nome;

const TODOS_ALUNOS_TAB = "todos";

export function Rankings() {
  const location = useLocation();
  const { escolas } = useEscolas();
  const escolasOrdenadas = useMemo(
    () => [...escolas].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    [escolas],
  );
  const [rankingAlunos, setRankingAlunos] = useState<AlunoRankingItem[]>([]);
  const [rankingEscolas, setRankingEscolas] = useState<EscolaRankingItem[]>([]);
  const [rankingTurmas, setRankingTurmas] = useState<TurmaRankingItem[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [selectedAlunoSchoolId, setSelectedAlunoSchoolId] = useState<string>(TODOS_ALUNOS_TAB);
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>("");
  const [topAlunosSemana, setTopAlunosSemana] = useState<AlunoRankingItem[]>([]);
  const [loadingInicial, setLoadingInicial] = useState(false);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [loadingEscolas, setLoadingEscolas] = useState(false);
  const [loadingTurmas, setLoadingTurmas] = useState(false);
  const [activeTab, setActiveTab] = useState("alunos");

  const loadSchoolOptions = async () => {
    setLoadingEscolas(true);

    try {
      const dados = await RankingsService.getRankingEscolas();
      const list = dados ?? [];
      setRankingEscolas(list);

      if (list.length > 0 && !selectedSchoolId) {
        setSelectedSchoolId(getSchoolKey(list[0]));
      }
    } catch (error) {
      console.error("Erro ao carregar escolas:", error);
      setRankingEscolas([]);
    } finally {
      setLoadingEscolas(false);
    }
  };

  const loadRankingSemanal = async () => {
    setLoadingInicial(true);

    try {
      const semana = await RankingsService.getRankingSemanalAlunos();
      setTopAlunosSemana(semana.slice(0, 3) ?? []);
    } catch (error) {
      console.error("Erro ao carregar ranking da semana:", error);
      setTopAlunosSemana([]);
    } finally {
      setLoadingInicial(false);
    }
  };

  const loadRankingAlunos = async (escolaId?: string) => {
    setLoadingAlunos(true);

    try {
      const alunos = await RankingsService.getRankingAlunos(asGuid(escolaId));
      setRankingAlunos(alunos ?? []);
    } catch (error) {
      console.error("Erro ao carregar ranking de alunos:", error);
      setRankingAlunos([]);
    } finally {
      setLoadingAlunos(false);
    }
  };

  const loadRankingTurmas = async (escolaId?: string) => {
    setLoadingTurmas(true);

    try {
      const dados = await RankingsService.getRankingTurmas(asGuid(escolaId));
      const list = dados ?? [];
      setRankingTurmas(list);

      if (list.length > 0) {
        const nextSelectedTurma =
          selectedTurmaId && list.some((turma) => getTurmaKey(turma) === selectedTurmaId)
            ? selectedTurmaId
            : getTurmaKey(list[0]);

        setSelectedTurmaId(nextSelectedTurma);
      } else {
        setSelectedTurmaId("");
      }
    } catch (error) {
      console.error("Erro ao carregar ranking de turmas:", error);
      setRankingTurmas([]);
      setSelectedTurmaId("");
    } finally {
      setLoadingTurmas(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    if (tab === "turmas") {
      setActiveTab("turmas");
    }
  }, [location.search]);

  useEffect(() => {
    void loadSchoolOptions();
    void loadRankingSemanal();
  }, []);

  useEffect(() => {
    const escolaId =
      selectedAlunoSchoolId === TODOS_ALUNOS_TAB ? undefined : selectedAlunoSchoolId;
    void loadRankingAlunos(escolaId);
  }, [selectedAlunoSchoolId]);

  useEffect(() => {
    if (activeTab !== "turmas") {
      return;
    }

    void loadRankingTurmas(selectedSchoolId);
  }, [selectedSchoolId, activeTab]);

  const selectedSchoolName =
    rankingEscolas.find((escola) => getSchoolKey(escola) === selectedSchoolId)?.nome || "Escola";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ranking Geral</h1>
        <p className="text-gray-500 mt-1">
          Acompanhe o desempenho e as conquistas dos participantes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);

        if (value === "escolas" && rankingEscolas.length === 0 && !loadingEscolas) {
          void loadSchoolOptions();
        }

        if (value === "turmas" && rankingTurmas.length === 0 && !loadingTurmas) {
          void loadRankingTurmas(selectedSchoolId);
        }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alunos" className="text-md">Alunos</TabsTrigger>
          <TabsTrigger value="turmas" className="text-md">Turmas</TabsTrigger>
          <TabsTrigger value="escolas" className="text-md">Escolas</TabsTrigger>
        </TabsList>

        <TabsContent value="alunos" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <Award className="h-5 w-5 text-purple-600" />
                Ranking da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingInicial ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  <span className="ml-3">Carregando ranking da semana...</span>
                </div>
              ) : topAlunosSemana.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma conquista registrada na última semana</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {topAlunosSemana.map((aluno, index) => {
                    const medalha = getMedalhaByNameOrTotal(aluno.medalha, aluno.total);
                    const medalhaLabel = aluno.medalha?.trim() ? aluno.medalha : medalha.nome;
                    const mostrarMedalha = Boolean(aluno.medalha && aluno.medalha.trim());

                    return (
                      <div
                        key={`${aluno.nome}-${aluno.posicao}`}
                        className={`rounded-xl border p-4 ${index === 0
                          ? "border-yellow-200 bg-yellow-50"
                          : index === 1
                            ? "border-slate-200 bg-slate-50"
                            : "border-orange-200 bg-orange-50"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getRankingBadge(index)}`}>
                            {index < 3 ? getMedalIcon(index) : <span className="text-xl font-bold">{aluno.posicao}</span>}
                          </div>
                          {mostrarMedalha && (
                            <img
                              src={getMedalhaImage(aluno.medalha, aluno.total)}
                              alt={medalhaLabel}
                              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                            />
                          )}
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-800">{aluno.nome}</h3>
                        <p className="text-sm text-slate-500">{aluno.turma || "-"}</p>
                        <p className="mt-3 text-2xl font-black text-slate-800">{aluno.total.toLocaleString("pt-BR")}</p>
                        <p className="text-xs text-slate-500">
                          {aluno.quantidadeTampinhas} tampinhas • {aluno.quantidadeLacres} lacres
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <Users className="h-5 w-5 text-yellow-500" />
                Ranking dos Alunos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                value={selectedAlunoSchoolId}
                onValueChange={setSelectedAlunoSchoolId}
                className="w-full"
              >
                <div className="overflow-x-auto pb-1">
                  <TabsList className="w-max">
                    <TabsTrigger value={TODOS_ALUNOS_TAB}>Todos</TabsTrigger>
                    {escolasOrdenadas.map((escola) => (
                      <TabsTrigger key={escola.id} value={escola.id}>
                        {escola.nome}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </Tabs>

              <div className="space-y-3">
                {loadingAlunos ? (
                  <div className="flex items-center justify-center py-10 text-gray-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                    <span className="ml-3">
                      {selectedAlunoSchoolId === TODOS_ALUNOS_TAB
                        ? "Carregando ranking de alunos..."
                        : "Carregando alunos da escola..."}
                    </span>
                  </div>
                ) : rankingAlunos.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      {selectedAlunoSchoolId === TODOS_ALUNOS_TAB
                        ? "Nenhum aluno encontrado"
                        : "Nenhum aluno encontrado para esta escola"}
                    </p>
                  </div>
                ) : (
                  rankingAlunos.map((aluno, index) => {
                    const medalha = getMedalhaByNameOrTotal(aluno.medalha, aluno.total);
                    const medalhaLabel = aluno.medalha?.trim() ? aluno.medalha : medalha.nome;
                    const mostrarMedalha = Boolean(aluno.medalha && aluno.medalha.trim());

                    return (
                      <div
                        key={`${aluno.nome}-${aluno.posicao}`}
                        className={`flex items-center justify-between rounded-lg border-2 p-4 ${index < 3 ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
                          }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getRankingBadge(index)}`}>
                            {index < 3 ? getMedalIcon(index) : <span className="text-xl font-bold">{aluno.posicao}</span>}
                          </div>
                          {mostrarMedalha && (
                            <img
                              src={getMedalhaImage(aluno.medalha, aluno.total)}
                              alt={medalhaLabel}
                              className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex flex-col items-start gap-1">
                              <div className="flex items-center">
                                <h3 className="font-semibold text-lg">{aluno.nome}</h3>
                              </div>
                              {mostrarMedalha && (
                                <div className="flex items-center text-lg font-semibold text-green-600">
                                  <span>{medalhaLabel}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex flex-row gap-3 items-center justify-end">
                            <span className="text-2xl font-bold text-green-600">{aluno.total.toLocaleString("pt-BR")}</span>
                          </div>
                          <div className="text-xs  text-gray-500">
                            <span>{aluno.quantidadeTampinhas} tampinhas</span>
                            {" • "}
                            <span>{aluno.quantidadeLacres} lacres</span>
                          </div>
                          <p className="text-xs text-gray-500">{"Turma: " + aluno.turma + " - " + aluno.escola || "-"}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="turmas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                Ranking de Turmas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingEscolas ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <span className="ml-3">Carregando turmas...</span>
                </div>
              ) : rankingEscolas.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma escola encontrada</p>
                </div>
              ) : (
                    <>
                      <Tabs value={selectedSchoolId || getSchoolKey(rankingEscolas[0])} onValueChange={setSelectedSchoolId} className="w-full">
                        <TabsList className="flex flex-wrap gap-2">
                          {rankingEscolas.map((escola) => (
                            <TabsTrigger
                              key={getSchoolKey(escola)}
                              value={getSchoolKey(escola)}
                              className="min-w-fit"
                            >
                              {escola.nome}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>

                      <div className="space-y-3">
                        {loadingTurmas ? (
                          <div className="flex items-center justify-center py-10 text-gray-500">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            <span className="ml-3">Carregando turmas da escola...</span>
                          </div>
                        ) : rankingTurmas.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Nenhuma turma cadastrada para esta escola</p>
                          </div>
                        ) : (
                          rankingTurmas.map((turma, index) => {
                            const turmaId = getTurmaKey(turma);
                            const isSelected = turmaId === selectedTurmaId;

                            return (
                              <button
                                key={turmaId}
                                type="button"
                                onClick={() => {
                                  setSelectedTurmaId(turmaId);
                                  const turmaNomeEncoded = encodeURIComponent(turma.nome);
                                  window.open(`/rankings/turma/${turmaId}?nome=${turmaNomeEncoded}`, "_blank", "noopener,noreferrer");
                                }}
                                className={`flex w-full items-center justify-between rounded-lg border-2 p-4 text-left transition ${isSelected ? "border-blue-300 bg-blue-50" : index < 3 ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"
                                  }`}
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getRankingBadge(index)}`}>
                                    {index < 3 ? getMedalIcon(index) : <span className="text-xl font-bold">{turma.posicao}</span>}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-blue-600 transition hover:text-blue-700 hover:underline hover:decoration-2 hover:underline-offset-2">
                                      {turma.nome}
                                    </h3>
                                    <p className="text-sm text-gray-500">{turma.escolaNome || selectedSchoolName}</p>
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="text-2xl font-bold text-blue-600">{turma.total.toLocaleString("pt-BR")}</div>
                                  <div className="text-xs text-gray-500">
                                    <span>{turma.quantidadeTampinhas} tampinhas</span>
                                    {" • "}
                                    <span>{turma.quantidadeLacres} lacres</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </>
              )}

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escolas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <Trophy className="h-5 w-5 text-purple-500" />
                Ranking de Escolas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEscolas ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
                  <span className="ml-3">Carregando ranking das escolas...</span>
                </div>
              ) : rankingEscolas.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma escola registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingEscolas.map((escola, index) => (
                    <div
                      key={getSchoolKey(escola)}
                      className={`flex items-center justify-between rounded-lg border-2 p-4 ${index < 3 ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-white"
                        }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getRankingBadge(index)}`}>
                          {index < 3 ? getMedalIcon(index) : <span className="text-xl font-bold">{escola.posicao}</span>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{escola.nome}</h3>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-purple-600">{escola.total.toLocaleString("pt-BR")}</div>
                        <p className="text-xs text-gray-500">
                          {escola.quantidadeTampinhas} tampinhas • {escola.quantidadeLacres} lacres
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
