import { useMemo, useState } from "react";
import { useDoacoes } from "./DoacoesContext";
import { useTurmas } from "@/pages/Turmas/TurmasContext";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { useCalendarios } from "@/pages/Calendario/CalendariosContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Gift, Check, Search, X } from "lucide-react";
import { toast } from "sonner";
import type { DoacoesFilter, DoacoesUpdatePayload } from "@/types/doacoes-types";

type DoacaoRegistro = {
  tampinhas: number;
  lacres: number;
};

export function Doacoes() {
  const { turmas } = useTurmas();
  const { calendarios } = useCalendarios();
  const { escolas } = useEscolas();

  const { doacoes, setFiltroDoacoes, buscarDoacoes, updateDoacoes } = useDoacoes();
  const [selectedEscola, setSelectedEscola] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedCalendario, setSelectedCalendario] = useState("");
  const [selectedData, setSelectedData] = useState(new Date().toISOString().split("T")[0]);
  const [turmaDoacoes, setTurmaDoacoes] = useState<Map<string, DoacaoRegistro>>(new Map());
  const [modoEdicao, setModoEdicao] = useState(false);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  const doacoesFilter = useMemo<DoacoesFilter>(() => ({
    calendarioId: selectedCalendario || undefined,
    data: selectedData || undefined,
    escolaId: selectedEscola || undefined,
    turmaId: selectedTurma || undefined,
  }), [selectedCalendario, selectedData, selectedEscola, selectedTurma]);

  const turmasFiltradas = turmas.filter((t) => t.escolaId === selectedEscola);

  const resetEdicao = () => {
    setTurmaDoacoes(new Map());
    setModoEdicao(false);
  };

  const resetBusca = () => {
    setBuscaRealizada(false);
    resetEdicao();
  };

  const handleBuscar = async () => {
    if (!selectedCalendario || !selectedData || !selectedEscola || !selectedTurma) {
      toast.error("Selecione calendario, data, escola e turma antes de buscar");
      return;
    }

    try {
      await buscarDoacoes(doacoesFilter);
      setBuscaRealizada(true);
      resetEdicao();
    } catch (error) {
      console.error("Erro ao buscar doacoes:", error);
    }
  };

  const handleIniciarRegistro = () => {
    if (!buscaRealizada) {
      toast.error("Busque as doacoes antes de editar");
      return;
    }

    const doacoesIniciais = new Map<string, DoacaoRegistro>();
    doacoes.forEach((doacao) => {
      doacoesIniciais.set(doacao.matriculaId, {
        tampinhas: doacao.qtdTampinha ?? 0,
        lacres: doacao.qtdLacre ?? 0,
      });
    });

    setModoEdicao(true);
    setTurmaDoacoes(doacoesIniciais);
  };

  const handleCancelar = () => {
    resetEdicao();
  };

  const handleSalvarTodas = async () => {
    if (!buscaRealizada) {
      toast.error("Busque as doacoes antes de salvar");
      return;
    }

    if (doacoes.some(doacao => !doacao.id)) {
      toast.error("Busque novamente antes de salvar. Existem doacoes sem id.");
      return;
    }

    const payload: DoacoesUpdatePayload = {
      escolaId: selectedEscola,
      calendarioId: selectedCalendario,
      data: `${selectedData}T00:00:00.000Z`,
      doacoes: doacoes.map((doacaoExistente) => {
        const matriculaId = doacaoExistente.matriculaId;
        const registro = turmaDoacoes.get(matriculaId);

        return {
          id: doacaoExistente.id as string,
          matriculaId,
          qtdTampinha: registro?.tampinhas ?? 0,
          qtdLacre: registro?.lacres ?? 0,
        };
      }),
    };

    try {
      await updateDoacoes(payload);
      await buscarDoacoes(doacoesFilter);
      toast.success("Doacoes salvas com sucesso!");
      resetEdicao();
    } catch (error) {
      console.error("Erro ao salvar doacoes:", error);
    }
  };

  const handleUpdateDoacaoField = (matriculaId: string, field: "tampinhas" | "lacres", value: number) => {
    setTurmaDoacoes(prev => {
      const newMap = new Map(prev);
      const doacao = newMap.get(matriculaId) || { tampinhas: 0, lacres: 0 };
      newMap.set(matriculaId, { ...doacao, [field]: value });
      return newMap;
    });
  };

  const handleCalendarioChange = (calendarioId: string) => {
    setSelectedCalendario(calendarioId);
    setFiltroDoacoes({ ...doacoesFilter, calendarioId });
    resetBusca();
  };

  const handleDataChange = (data: string) => {
    setSelectedData(data);
    setFiltroDoacoes({ ...doacoesFilter, data });
    resetBusca();
  };

  const handleEscolaChange = (escolaId: string) => {
    setSelectedEscola(escolaId);
    setSelectedTurma("");
    setFiltroDoacoes({ ...doacoesFilter, escolaId, turmaId: undefined });
    resetBusca();
  };

  const handleTurmaChange = (turmaId: string) => {
    setSelectedTurma(turmaId);
    setFiltroDoacoes({ ...doacoesFilter, turmaId });
    resetBusca();
  };

  const getTotalTampinhas = (matriculaId: string) => {
    return doacoes
      .filter(d => d.matriculaId === matriculaId && d.calendarioId === selectedCalendario)
      .reduce((sum, d) => sum + d.qtdTampinha, 0);
  };

  const getTotalLacres = (matriculaId: string) => {
    return doacoes
      .filter(d => d.matriculaId === matriculaId && d.calendarioId === selectedCalendario)
      .reduce((sum, d) => sum + d.qtdLacre, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doacoes</h1>
        <p className="text-gray-500 mt-1">Registre as doacoes da turma</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecione a Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="calendario">Calendario/Ano *</Label>
              <Select value={selectedCalendario} onValueChange={handleCalendarioChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o calendario" />
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
                onChange={(e) => handleDataChange(e.target.value)}
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
                      {turma.nome} - {turma.anoEscolar} - {turma.turno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleBuscar}
                disabled={!selectedCalendario || !selectedData || !selectedEscola || !selectedTurma}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {buscaRealizada && (
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
                  disabled={doacoes.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Editar Doacoes
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
            {doacoes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhuma doacao encontrada para os filtros selecionados</p>
              </div>
            ) : (
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
                    {doacoes.map((doacaoExistente) => {
                      const matriculaId = doacaoExistente.matriculaId;
                      const doacao = turmaDoacoes.get(matriculaId);

                    return (
                      <TableRow key={doacaoExistente.id ?? matriculaId}>
                        <TableCell className="font-medium">{doacaoExistente.nomeAluno}</TableCell>
                        {modoEdicao ? (
                          <>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="0"
                                value={doacao?.tampinhas ?? 0}
                                onChange={(e) => handleUpdateDoacaoField(matriculaId, "tampinhas", parseInt(e.target.value) || 0)}
                                className="w-24 mx-auto"
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="0"
                                value={doacao?.lacres ?? 0}
                                onChange={(e) => handleUpdateDoacaoField(matriculaId, "lacres", parseInt(e.target.value) || 0)}
                                className="w-24 mx-auto"
                                placeholder="0"
                              />
                            </TableCell>
                          </>
                        ) : selectedCalendario ? (
                          <>
                            <TableCell className="text-center font-semibold text-green-600">
                                {getTotalTampinhas(matriculaId)}
                              </TableCell>
                              <TableCell className="text-center font-semibold text-emerald-600">
                              {getTotalLacres(matriculaId)}
                            </TableCell>
                          </>
                        ) : null}
                      </TableRow>
                    );
                  })}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
