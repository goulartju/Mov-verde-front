import { useEffect, useMemo, useState } from "react";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { useTurmas } from "@/pages/Turmas/TurmasContext";
import { useAlunos } from "@/pages/Alunos/AlunosContext";
import { DoacoesService } from "@/services/doacoes.service";
import type { Doacao } from "@/types/doacoes-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  School,
  Users,
  UserPlus,
  Gift,
  TrendingUp,
  Award,
  Trophy
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Medalhas } from "@/types/ranking-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export function Dashboard() {
  const { escolas } = useEscolas();
  const { turmas } = useTurmas();
  const { alunos } = useAlunos();
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregandoDoacoes, setCarregandoDoacoes] = useState(true);

  useEffect(() => {
    DoacoesService.getAll()
      .then((dados) => setDoacoes(Array.isArray(dados) ? dados : []))
      .catch((error) =>
        console.error("Erro ao carregar doacoes do dashboard:", error),
      )
      .finally(() => setCarregandoDoacoes(false));
  }, []);

  const { totalTampinhas, totalLacres, totalDoacoes, doacoesPorEscola } =
    useMemo(() => {
      const valorTampinhas = (doacao: Doacao) =>
        doacao.tampinhas ?? doacao.qtdTampinha ?? 0;
      const valorLacres = (doacao: Doacao) =>
        doacao.lacres ?? doacao.qtdLacre ?? 0;

      const totalTampinhas = doacoes.reduce(
        (total, doacao) => total + valorTampinhas(doacao),
        0,
      );
      const totalLacres = doacoes.reduce(
        (total, doacao) => total + valorLacres(doacao),
        0,
      );
      const doacoesPorEscola = escolas
        .map((escola) => {
          const doacoesDaEscola = doacoes.filter(
            (doacao) => doacao.escolaId === escola.id,
          );
          const tampinhas = doacoesDaEscola.reduce(
            (total, doacao) => total + valorTampinhas(doacao),
            0,
          );
          const lacres = doacoesDaEscola.reduce(
            (total, doacao) => total + valorLacres(doacao),
            0,
          );

          return { nome: escola.nome, tampinhas, lacres };
        })
        .filter((escola) => escola.tampinhas > 0 || escola.lacres > 0);

      return {
        totalTampinhas,
        totalLacres,
        totalDoacoes: totalTampinhas + totalLacres,
        doacoesPorEscola,
      };
    }, [doacoes, escolas]);

  const tiposDoacao = [
    { nome: "Tampinhas", valor: totalTampinhas },
    { nome: "Lacres", valor: totalLacres },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Visão geral da arrecadação
        </p>
      </div>

      <Tabs defaultValue="estatisticas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="sistema-medalhas">
            Sistema de Conquistas
          </TabsTrigger>
        </TabsList>

        {/* Aba de Estatísticas */}
        <TabsContent value="estatisticas" className="space-y-4">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold text-slate-800">Escolas</CardTitle>
                <School className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{escolas.length}</div>
                <p className="text-xs text-gray-500 mt-1">Total cadastradas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold text-slate-800">Turmas</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{turmas.length}</div>
                <p className="text-xs text-gray-500 mt-1">Total cadastradas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold text-slate-800">Alunos</CardTitle>
                <UserPlus className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alunos.length}</div>
                <p className="text-xs text-gray-500 mt-1">Total cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg text-red-500 font-bold">Doações</CardTitle>
                <Gift className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl text-red-500 font-bold">
                  {totalDoacoes.toLocaleString("pt-BR")}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tampinhas + lacres
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cards de Totais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-[#0e55b7]/15 border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#0e55b7]">Lacres Arrecadados</CardTitle>
                <Award className="h-6 w-6 text-[#0e55b7]" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[#0e55b7]">
                  {totalLacres.toLocaleString("pt-BR")}
                </div>
                <p className="text-sm text-[#0e55b7] mt-2">Total acumulado</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-600">Tampinhas Arrecadadas</CardTitle>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  {totalTampinhas.toLocaleString("pt-BR")}
                </div>
                <p className="text-sm text-green-600 mt-2">Total acumulado</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras */}
            <Card>
              <CardHeader>
                <CardTitle>Arrecadação por Escola</CardTitle>
              </CardHeader>
              <CardContent>
                {carregandoDoacoes ? (
                  <div className="flex h-[500px] items-center justify-center text-gray-400">
                    Carregando doações...
                  </div>
                ) : doacoesPorEscola.length > 0 ? (
                    <ResponsiveContainer width="100%" height={420}>
                      <BarChart
                        data={doacoesPorEscola}
                        margin={{ top: 20, right: 20, left: 10, bottom: 90 }}
                      >
                        <XAxis
                          dataKey="nome"
                          interval={0}
                          angle={-35}
                          textAnchor="end"
                          height={90}
                          tickMargin={12}
                          minTickGap={0}
                          tick={{ fontSize: 12 }}
                        />
                      <YAxis />
                      <Tooltip />
                        <Legend verticalAlign="top" />
                      <Bar
                        dataKey="tampinhas"
                        fill="#16a34a"
                        name="Tampinhas"
                      />
                      <Bar dataKey="lacres" fill="#0f5dc9" name="Lacres" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-gray-400">
                    Nenhuma doação registrada
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de Pizza */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Doações</CardTitle>
              </CardHeader>
              <CardContent>
                {carregandoDoacoes ? (
                  <div className="flex h-[300px] items-center justify-center text-gray-400">
                    Carregando doações...
                  </div>
                ) : totalTampinhas > 0 || totalLacres > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tiposDoacao}
                        dataKey="valor"
                        nameKey="nome"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill="#16a34a" />
                        <Cell fill="#0f5dc9" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-gray-400">
                    Nenhuma doação registrada
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sistema-medalhas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Sistema de Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="text-sm text-emerald-800">
                  Conquistas disponíveis para os alunos conforme o total de
                  arrecadação acumulada.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Medalhas.map((medalha) => (
                  <div
                    key={medalha.nome}
                    className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-emerald-100 to-green-200 shadow-md">
                        <img
                          src={medalha.imagem}
                          alt={medalha.nome}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-bold text-slate-800">
                          {medalha.nome}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {medalha.descricao}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
                        Total necessário
                      </p>
                      <p className="mt-1 text-2xl font-black text-slate-800">
                        {medalha.totalNecessario.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
