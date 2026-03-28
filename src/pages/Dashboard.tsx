import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { School, Users, UserPlus, Gift, TrendingUp, Award, Trophy, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// Sistema de Medalhas - Inspirado em Escoteiros
interface Medalha {
  nome: string;
  cor: string;
  icone: string;
  minTampinhas: number;
  minLacres: number;
  minTotal: number;
  descricao: string;
}

const MEDALHAS: Medalha[] = [
  { nome: "Iniciante", cor: "gray", icone: "🌱", minTampinhas: 0, minLacres: 0, minTotal: 0, descricao: "Começou a jornada" },
  { nome: "Bronze", cor: "orange", icone: "🥉", minTampinhas: 50, minLacres: 20, minTotal: 100, descricao: "Primeiros passos" },
  { nome: "Prata", cor: "gray", icone: "🥈", minTampinhas: 150, minLacres: 50, minTotal: 300, descricao: "Progresso notável" },
  { nome: "Ouro", cor: "yellow", icone: "🥇", minTampinhas: 300, minLacres: 100, minTotal: 600, descricao: "Dedicação exemplar" },
  { nome: "Esmeralda", cor: "emerald", icone: "💎", minTampinhas: 500, minLacres: 200, minTotal: 1000, descricao: "Guerreiro verde" },
  { nome: "Safira", cor: "blue", icone: "🔷", minTampinhas: 800, minLacres: 350, minTotal: 1500, descricao: "Protetor da natureza" },
  { nome: "Rubi", cor: "red", icone: "💍", minTampinhas: 1200, minLacres: 500, minTotal: 2200, descricao: "Campeão sustentável" },
  { nome: "Diamante", cor: "cyan", icone: "💠", minTampinhas: 1800, minLacres: 750, minTotal: 3200, descricao: "Elite da reciclagem" },
  { nome: "Mestre Eco", cor: "green", icone: "🌟", minTampinhas: 2500, minLacres: 1000, minTotal: 5000, descricao: "Lenda da sustentabilidade" },
];

export function Dashboard() {
  const { escolas, turmas, alunos, doacoes } = useData();

  // Calcular estatísticas
  const totalTampinhas = doacoes.reduce((sum, d) => sum + d.tampinhas, 0);
  const totalLacres = doacoes.reduce((sum, d) => sum + d.lacres, 0);

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

  // Calcular medalhas dos alunos
  const alunosComMedalhas = alunos.map((aluno) => {
    const doacoesAluno = doacoes.filter((d) => d.alunoId === aluno.id);
    const totalTampinhas = doacoesAluno.reduce((sum, d) => sum + d.tampinhas, 0);
    const totalLacres = doacoesAluno.reduce((sum, d) => sum + d.lacres, 0);
    const totalGeral = totalTampinhas + totalLacres;

    const medalha = getMedalhaAluno(totalTampinhas, totalLacres, totalGeral);
    const turma = turmas.find((t) => t.id === aluno.turmaId);
    const escola = escolas.find((e) => e.id === turma?.escolaId);

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
  }).sort((a, b) => b.total - a.total);

  // Contar alunos por medalha
  const distribuicaoMedalhas = MEDALHAS.map(medalha => ({
    nome: medalha.nome,
    quantidade: alunosComMedalhas.filter(a => a.medalha.nome === medalha.nome).length,
    cor: medalha.cor,
    icone: medalha.icone,
  })).filter(m => m.quantidade > 0);

  // Dados para gráficos
  const doacoesPorEscola = escolas.map(escola => {
    const doacoesEscola = doacoes.filter(d => d.escolaId === escola.id);
    const tampinhas = doacoesEscola.reduce((sum, d) => sum + d.tampinhas, 0);
    const lacres = doacoesEscola.reduce((sum, d) => sum + d.lacres, 0);
    return {
      nome: escola.nome,
      tampinhas,
      lacres,
      total: tampinhas + lacres
    };
  });

  const tipoDoacoes = [
    { name: "Tampinhas", value: totalTampinhas },
    { name: "Lacres", value: totalLacres },
  ];

  const COLORS = ['#16a34a', '#22c55e'];

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

  // Calcular conquistas semanais (últimos 7 dias)
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - 7);

  const doacoesRecentes = doacoes.filter(d => new Date(d.data) >= dataLimite);

  const conquistaSemanalTampinhas = alunosComMedalhas
    .map(aluno => ({
      ...aluno,
      tampinhasSemana: doacoesRecentes
        .filter(d => d.alunoId === aluno.id)
        .reduce((sum, d) => sum + d.tampinhas, 0),
    }))
    .filter(a => a.tampinhasSemana > 0)
    .sort((a, b) => b.tampinhasSemana - a.tampinhasSemana)[0];

  const conquistaSemanalLacres = alunosComMedalhas
    .map(aluno => ({
      ...aluno,
      lacresSemana: doacoesRecentes
        .filter(d => d.alunoId === aluno.id)
        .reduce((sum, d) => sum + d.lacres, 0),
    }))
    .filter(a => a.lacresSemana > 0)
    .sort((a, b) => b.lacresSemana - a.lacresSemana)[0];

  const conquistaSemanalTotal = alunosComMedalhas
    .map(aluno => ({
      ...aluno,
      totalSemana: doacoesRecentes
        .filter(d => d.alunoId === aluno.id)
        .reduce((sum, d) => sum + d.tampinhas + d.lacres, 0),
    }))
    .filter(a => a.totalSemana > 0)
    .sort((a, b) => b.totalSemana - a.totalSemana)[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral da arrecadação e gamificação</p>
      </div>

      <Tabs defaultValue="estatisticas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="gamificacao">Gamificação</TabsTrigger>
          <TabsTrigger value="sistema-medalhas">Sistema de Medalhas</TabsTrigger>
        </TabsList>

        {/* Aba de Estatísticas */}
        <TabsContent value="estatisticas" className="space-y-4">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Escolas</CardTitle>
                <School className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{escolas.length}</div>
                <p className="text-xs text-gray-500">Total cadastradas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Turmas</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{turmas.length}</div>
                <p className="text-xs text-gray-500">Total cadastradas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Alunos</CardTitle>
                <UserPlus className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alunos.length}</div>
                <p className="text-xs text-gray-500">Total cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">Doações</CardTitle>
                <Gift className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doacoes.length}</div>
                <p className="text-xs text-gray-500">Total registradas</p>
              </CardContent>
            </Card>
          </div>

          {/* Cards de Totais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tampinhas Arrecadadas</CardTitle>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-700">{totalTampinhas.toLocaleString('pt-BR')}</div>
                <p className="text-sm text-green-600 mt-2">Total acumulado</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lacres Arrecadados</CardTitle>
                <Award className="h-6 w-6 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-emerald-700">{totalLacres.toLocaleString('pt-BR')}</div>
                <p className="text-sm text-emerald-600 mt-2">Total acumulado</p>
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
                {doacoesPorEscola.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={doacoesPorEscola}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tampinhas" fill="#16a34a" name="Tampinhas" />
                      <Bar dataKey="lacres" fill="#22c55e" name="Lacres" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
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
                {totalTampinhas > 0 || totalLacres > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tipoDoacoes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {tipoDoacoes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    Nenhuma doação registrada
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Aba de Gamificação */}
        <TabsContent value="gamificacao" className="space-y-4">

          {/* Conquistas Especiais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Conquistas Especiais da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              {doacoesRecentes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma doação nos últimos 7 dias</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Maior Doação de Tampinhas da Semana */}
                  {conquistaSemanalTampinhas && (
                    <div className="p-4 rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-2xl shadow-lg">
                          🥤
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-700">Rei das Tampinhas</h4>
                          <p className="text-xs text-gray-500">Maior doação semanal</p>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-semibold text-sm">{conquistaSemanalTampinhas.nome}</p>
                        <p className="text-xs text-gray-500">{conquistaSemanalTampinhas.turma}</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                          {conquistaSemanalTampinhas.tampinhasSemana}
                        </p>
                        <p className="text-xs text-gray-500">tampinhas esta semana</p>
                      </div>
                    </div>
                  )}

                  {/* Maior Doação de Lacres da Semana */}
                  {conquistaSemanalLacres && (
                    <div className="p-4 rounded-lg border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-2xl shadow-lg">
                          🔗
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-700">Mestre dos Lacres</h4>
                          <p className="text-xs text-gray-500">Maior doação semanal</p>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-semibold text-sm">{conquistaSemanalLacres.nome}</p>
                        <p className="text-xs text-gray-500">{conquistaSemanalLacres.turma}</p>
                        <p className="text-2xl font-bold text-emerald-600 mt-2">
                          {conquistaSemanalLacres.lacresSemana}
                        </p>
                        <p className="text-xs text-gray-500">lacres esta semana</p>
                      </div>
                    </div>
                  )}

                  {/* Maior Doação Total da Semana */}
                  {conquistaSemanalTotal && (
                    <div className="p-4 rounded-lg border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-2xl shadow-lg">
                          ⭐
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-700">Campeão da Semana</h4>
                          <p className="text-xs text-gray-500">Maior doação total</p>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="font-semibold text-sm">{conquistaSemanalTotal.nome}</p>
                        <p className="text-xs text-gray-500">{conquistaSemanalTotal.turma}</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-2">
                          {conquistaSemanalTotal.totalSemana}
                        </p>
                        <p className="text-xs text-gray-500">total esta semana</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Distribuição de Medalhas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Distribuição de Medalhas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {distribuicaoMedalhas.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma doação registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {distribuicaoMedalhas.map((item) => (
                    <div key={item.nome} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                      <div className={`w-10 h-10 rounded-full ${getMedalhaColor(item.cor)} flex items-center justify-center text-xl shadow`}>
                        {item.icone}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.nome}</h4>
                        <p className="text-sm text-gray-500">{item.quantidade} {item.quantidade === 1 ? 'aluno' : 'alunos'}</p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{item.quantidade}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Alunos com Medalhas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Alunos e suas Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alunosComMedalhas.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma doação registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alunosComMedalhas.slice(0, 10).map((aluno, index) => (
                    <div
                      key={aluno.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 ${index < 3 ? "border-green-200 bg-green-50" : "border-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full ${getMedalhaColor(aluno.medalha.cor)} flex items-center justify-center text-2xl shadow-lg`}>
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

        <TabsContent value="sistema-medalhas" className="space-y-4">
          {/* Sistema de Medalhas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Sistema de Medalhas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MEDALHAS.map((medalha) => (
                  <div
                    key={medalha.nome}
                    className="p-4 rounded-lg border-2 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-full ${getMedalhaColor(medalha.cor)} flex items-center justify-center text-2xl shadow-lg`}>
                        {medalha.icone}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{medalha.nome}</h3>
                        <p className="text-xs text-gray-500">{medalha.descricao}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
                      <div>• {medalha.minTampinhas} tampinhas</div>
                      <div>• {medalha.minLacres} lacres</div>
                      <div className="font-semibold">• {medalha.minTotal} total</div>
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
