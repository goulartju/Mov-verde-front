import { useState } from "react";
import { useDoacoes } from "./DoacoesContext";
import { useAlunos } from "@/pages/Alunos/AlunosContext";
import { useTurmas } from "@/pages/Turmas/TurmasContext";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { useCalendarios } from "@/pages/Calendario/CalendariosContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Gift, Check, X } from "lucide-react";
import { toast } from "sonner";

interface AlunoDoacao {
  alunoId: string;
  tampinhas: number;
  lacres: number;
  editando: boolean;
}

export function Doacoes() {
  const { doacoes, addDoacao } = useDoacoes();
  const { alunos } = useAlunos();
  const { turmas } = useTurmas();
  const { escolas } = useEscolas();
  const { calendarios } = useCalendarios();
  const [selectedEscola, setSelectedEscola] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedCalendario, setSelectedCalendario] = useState("");
  const [selectedData, setSelectedData] = useState(new Date().toISOString().split('T')[0]);
  const [alunosDoacoes, setAlunosDoacoes] = useState<Map<string, AlunoDoacao>>(new Map());
  const [modoEdicao, setModoEdicao] = useState(false);

  const resetForm = () => {
    setSelectedEscola("");
    setSelectedTurma("");
    setSelectedCalendario("");
    setSelectedData(new Date().toISOString().split('T')[0]);
    setAlunosDoacoes(new Map());
    setModoEdicao(false);
  };

  const handleIniciarRegistro = () => {
    if (!selectedCalendario || !selectedData) {
      toast.error("Selecione o calendário e a data antes de registrar");
      return;
    }
    setModoEdicao(true);
    setAlunosDoacoes(new Map());
  };

  const handleCancelar = () => {
    setModoEdicao(false);
    setAlunosDoacoes(new Map());
  };

  const handleSalvarTodas = () => {
    if (!selectedCalendario || !selectedData) {
      toast.error("Selecione o calendário e a data");
      return;
    }

    let salvouAlguma = false;

    alunosDoacoes.forEach((doacao, alunoId) => {
      if (doacao.tampinhas > 0 || doacao.lacres > 0) {
        addDoacao({
          alunoId,
          turmaId: selectedTurma,
          escolaId: selectedEscola,
          data: selectedData,
          tampinhas: doacao.tampinhas,
          lacres: doacao.lacres,
          calendarioId: selectedCalendario,
        });
        salvouAlguma = true;
      }
    });

    if (salvouAlguma) {
      toast.success("Doações registradas com sucesso!");
      setModoEdicao(false);
      setAlunosDoacoes(new Map());
    } else {
      toast.error("Informe pelo menos uma doação para salvar");
    }
  };

  const handleUpdateDoacaoField = (alunoId: string, field: 'tampinhas' | 'lacres', value: number) => {
    setAlunosDoacoes(prev => {
      const newMap = new Map(prev);
      const doacao = newMap.get(alunoId) || { alunoId, tampinhas: 0, lacres: 0, editando: true };
      newMap.set(alunoId, { ...doacao, [field]: value });
      return newMap;
    });
  };

  const turmasFiltradas = turmas.filter((t) => t.escolaId === selectedEscola);
  const alunosFiltrados = alunos.filter((a) => a.turmaId === selectedTurma);

  const handleEscolaChange = (escolaId: string) => {
    setSelectedEscola(escolaId);
    setSelectedTurma("");
    setAlunosDoacoes(new Map());
    setModoEdicao(false);
  };

  const handleTurmaChange = (turmaId: string) => {
    setSelectedTurma(turmaId);
    setAlunosDoacoes(new Map());
    setModoEdicao(false);
  };

  const getTotalTampinhas = (alunoId: string) => {
    return doacoes
      .filter(d => d.alunoId === alunoId && d.calendarioId === selectedCalendario)
      .reduce((sum, d) => sum + d.tampinhas, 0);
  };

  const getTotalLacres = (alunoId: string) => {
    return doacoes
      .filter(d => d.alunoId === alunoId && d.calendarioId === selectedCalendario)
      .reduce((sum, d) => sum + d.lacres, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doações</h1>
        <p className="text-gray-500 mt-1">Registre as doações  turma</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione a Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="calendario">Calendário/Ano *</Label>
              <Select value={selectedCalendario} onValueChange={setSelectedCalendario}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o calendário" />
                </SelectTrigger>
                <SelectContent>
                  {calendarios.filter(c => c.ativo).map((calendario) => (
                    <SelectItem key={calendario.id} value={calendario.id}>
                      {calendario.ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={selectedData}
                onChange={(e) => setSelectedData(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="escola">Escola *</Label>
              <Select value={selectedEscola} onValueChange={handleEscolaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {escolas.map((escola) => (
                    <SelectItem key={escola.id} value={escola.id}>
                      {escola.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="turma">Turma *</Label>
              <Select
                value={selectedTurma}
                onValueChange={handleTurmaChange}
                disabled={!selectedEscola}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmasFiltradas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alunos */}
      {selectedTurma && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Alunos da Turma
              </CardTitle>
              {!modoEdicao ? (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleIniciarRegistro}
                  disabled={!selectedCalendario || !selectedData}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Doações
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSalvarTodas}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Salvar Todas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelar}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {alunosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhum aluno cadastrado nesta turma</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      {modoEdicao && (
                        <>
                          <TableHead className="text-center">Tampinhas</TableHead>
                          <TableHead className="text-center">Lacres</TableHead>
                        </>
                      )}
                      {!modoEdicao && selectedCalendario && (
                        <>
                          <TableHead className="text-center">Total Tampinhas</TableHead>
                          <TableHead className="text-center">Total Lacres</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosFiltrados.map((aluno) => {
                      const doacao = alunosDoacoes.get(aluno.id);

                      return (
                        <TableRow key={aluno.id}>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          {modoEdicao ? (
                            <>
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  value={doacao?.tampinhas || 0}
                                  onChange={(e) => handleUpdateDoacaoField(aluno.id, 'tampinhas', parseInt(e.target.value) || 0)}
                                  className="w-24 mx-auto"
                                  placeholder="0"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  value={doacao?.lacres || 0}
                                  onChange={(e) => handleUpdateDoacaoField(aluno.id, 'lacres', parseInt(e.target.value) || 0)}
                                  className="w-24 mx-auto"
                                  placeholder="0"
                                />
                              </TableCell>
                            </>
                          ) : selectedCalendario ? (
                            <>
                              <TableCell className="text-center font-semibold text-green-600">
                                {getTotalTampinhas(aluno.id)}
                              </TableCell>
                              <TableCell className="text-center font-semibold text-emerald-600">
                                {getTotalLacres(aluno.id)}
                              </TableCell>
                            </>
                          ) : null}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
