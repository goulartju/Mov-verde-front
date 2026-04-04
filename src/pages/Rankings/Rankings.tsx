import { useAlunos } from "@/pages/Alunos/AlunosContext";
import { useTurmas } from "@/pages/Turmas/TurmasContext";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { useDoacoes } from "@/pages/Doacoes/DoacoesContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// Sistema de Medalhas
interface Medalha {
  nome: string;
  cor: string;
  icone: string;
  minTampinhas: number;
  minLacres: number;
  minTotal: number;
}

const MEDALHAS: Medalha[] = [
  { nome: "Iniciante", cor: "gray", icone: "🌱", minTampinhas: 0, minLacres: 0, minTotal: 0 },
  { nome: "Bronze", cor: "orange", icone: "🥉", minTampinhas: 50, minLacres: 20, minTotal: 100 },
  { nome: "Prata", cor: "gray", icone: "🥈", minTampinhas: 150, minLacres: 50, minTotal: 300 },
  { nome: "Ouro", cor: "yellow", icone: "🥇", minTampinhas: 300, minLacres: 100, minTotal: 600 },
  { nome: "Esmeralda", cor: "emerald", icone: "💎", minTampinhas: 500, minLacres: 200, minTotal: 1000 },
  { nome: "Safira", cor: "blue", icone: "🔷", minTampinhas: 800, minLacres: 350, minTotal: 1500 },
  { nome: "Rubi", cor: "red", icone: "💍", minTampinhas: 1200, minLacres: 500, minTotal: 2200 },
  { nome: "Diamante", cor: "cyan", icone: "💠", minTampinhas: 1800, minLacres: 750, minTotal: 3200 },
  { nome: "Mestre Eco", cor: "green", icone: "🌟", minTampinhas: 2500, minLacres: 1000, minTotal: 5000 },
];

export function Rankings() {
  const { alunos } = useAlunos();
  const { turmas } = useTurmas();
  const { escolas } = useEscolas();
  const { doacoes } = useDoacoes();

  // Função para obter medalha do aluno
  const getMedalhaAluno = (tampinhas: number, lacres: number, total: number): Medalha => {
    for (let i = MEDALHAS.length - 1; i >= 0; i--) {
      const medalha = MEDALHAS[i];
      if (tampinhas >= medalha.minTampinhas && lacres >= medalha.minLacres && total >= medalha.minTotal) {
        return medalha;
      }
    }
    return MEDALHAS[0];
  };

  const getMedalhaColor = (cor: string) => {
    const colors: Record<string, string> = {
      gray: "bg-gray-400",
      orange: "bg-orange-600",
      yellow: "bg-yellow-400",
      emerald: "bg-emerald-500",
      blue: "bg-blue-500",
      red: "bg-red-500",
      cyan: "bg-cyan-400",
      green: "bg-green-600",
    };
    return colors[cor] || "bg-gray-400";
  };

  // Calcular ranking de alunos
  const rankingAlunos = alunos
    .map((aluno) => {
      const doacoesAluno = doacoes.filter((d) => d.alunoId === aluno.id);
      const totalTampinhas = doacoesAluno.reduce((sum, d) => sum + d.tampinhas, 0);
      const totalLacres = doacoesAluno.reduce((sum, d) => sum + d.lacres, 0);
      const totalGeral = totalTampinhas + totalLacres;

      const turma = turmas.find((t) => t.id === aluno.turmaId);
      const escola = escolas.find((e) => e.id === turma?.escolaId);
      const medalha = getMedalhaAluno(totalTampinhas, totalLacres, totalGeral);

      return {
        id: aluno.id,
        nome: aluno.nome,
        turma: turma?.nome || "-",
        escola: escola?.nome || "-",
        tampinhas: totalTampinhas,
        lacres: totalLacres,
        total: totalGeral,
        medalha,
      };
    })
    .sort((a, b) => b.total - a.total);

  // Calcular ranking de turmas
  const rankingTurmas = turmas
    .map((turma) => {
      const doacoesTurma = doacoes.filter((d) => d.turmaId === turma.id);
      const totalTampinhas = doacoesTurma.reduce((sum, d) => sum + d.tampinhas, 0);
      const totalLacres = doacoesTurma.reduce((sum, d) => sum + d.lacres, 0);
      const totalGeral = totalTampinhas + totalLacres;

      const escola = escolas.find((e) => e.id === turma.escolaId);
      const alunosDaTurma = alunos.filter((a) => a.turmaId === turma.id).length;

      return {
        id: turma.id,
        nome: turma.nome,
        escola: escola?.nome || "-",
        ano: turma.ano,
        tampinhas: totalTampinhas,
        lacres: totalLacres,
        total: totalGeral,
        alunos: alunosDaTurma,
        mediaPorAluno: alunosDaTurma > 0 ? (totalGeral / alunosDaTurma).toFixed(1) : "0",
      };
    })
    .sort((a, b) => b.total - a.total);

  // Calcular ranking de escolas
  const rankingEscolas = escolas
    .map((escola) => {
      const doacoesEscola = doacoes.filter((d) => d.escolaId === escola.id);
      const totalTampinhas = doacoesEscola.reduce((sum, d) => sum + d.tampinhas, 0);
      const totalLacres = doacoesEscola.reduce((sum, d) => sum + d.lacres, 0);
      const totalGeral = totalTampinhas + totalLacres;

      const turmasDaEscola = turmas.filter((t) => t.escolaId === escola.id).length;
      const alunosDaEscola = alunos.filter((a) => {
        const turma = turmas.find((t) => t.id === a.turmaId);
        return turma?.escolaId === escola.id;
      }).length;

      return {
        id: escola.id,
        nome: escola.nome,
        tampinhas: totalTampinhas,
        lacres: totalLacres,
        total: totalGeral,
        turmas: turmasDaEscola,
        alunos: alunosDaEscola,
      };
    })
    .sort((a, b) => b.total - a.total);

  const getMedalIcon = (position: number) => {
    if (position === 0) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (position === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (position === 2) return <Medal className="h-6 w-6 text-orange-600" />;
    return null;
  };

  const getRankingBadge = (position: number) => {
    if (position === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (position === 1) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (position === 2) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ranking Geral</h1>
        <p className="text-gray-500 mt-1">Acompanhe o desempenho e as conquistas dos participantes</p>
      </div>

      <Tabs defaultValue="alunos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="turmas">Turmas</TabsTrigger>
          <TabsTrigger value="escolas">Escolas</TabsTrigger>
        </TabsList>

        {/* Ranking de Alunos */}
        <TabsContent value="alunos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Ranking de Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rankingAlunos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma doação registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingAlunos.map((aluno, index) => (
                    <div
                      key={aluno.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${index < 3 ? "border-green-200 bg-green-50" : "border-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankingBadge(index)}`}>
                          {index < 3 ? getMedalIcon(index) : <span className="text-xl font-bold">{index + 1}</span>}
                        </div>
                        <div className={`w-10 h-10 rounded-full ${getMedalhaColor(aluno.medalha.cor)} flex items-center justify-center text-xl shadow-lg`}>
                          {aluno.medalha.icone}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{aluno.nome}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${getMedalhaColor(aluno.medalha.cor)}`}>
                              {aluno.medalha.nome}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {aluno.turma} - {aluno.escola}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-green-600">{aluno.total.toLocaleString('pt-BR')}</div>
                        <div className="text-xs text-gray-500">
                          <span className="text-green-600">{aluno.tampinhas} tampinhas</span>
                          {" • "}
                          <span className="text-emerald-600">{aluno.lacres} lacres</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking de Turmas */}
        <TabsContent value="turmas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                Ranking de Turmas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rankingTurmas.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma doação registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingTurmas.map((turma, index) => (
                    <div
                      key={turma.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${index < 3 ? "border-blue-200 bg-blue-50" : "border-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankingBadge(index)}`}>
                          {index < 3 ? getMedalIcon(index) : <span className="text-xl font-bold">{index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {turma.nome} - {turma.ano}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {turma.escola} • {turma.alunos} alunos
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-blue-600">{turma.total.toLocaleString('pt-BR')}</div>
                        <div className="text-xs text-gray-500">
                          <span className="text-green-600">{turma.tampinhas} tampinhas</span>
                          {" • "}
                          <span className="text-emerald-600">{turma.lacres} lacres</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Média: {turma.mediaPorAluno} por aluno
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking de Escolas */}
        <TabsContent value="escolas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                Ranking de Escolas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rankingEscolas.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma doação registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rankingEscolas.map((escola, index) => (
                    <div
                      key={escola.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${index < 3 ? "border-purple-200 bg-purple-50" : "border-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankingBadge(index)}`}>
                          {index < 3 ? getMedalIcon(index) : <span className="text-xl font-bold">{index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{escola.nome}</h3>
                          <p className="text-sm text-gray-500">
                            {escola.turmas} turmas • {escola.alunos} alunos
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold text-purple-600">{escola.total.toLocaleString('pt-BR')}</div>
                        <div className="text-xs text-gray-500">
                          <span className="text-green-600">{escola.tampinhas} tampinhas</span>
                          {" • "}
                          <span className="text-emerald-600">{escola.lacres} lacres</span>
                        </div>
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
