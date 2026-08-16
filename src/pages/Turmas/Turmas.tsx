import { useTurmas } from "./TurmasContext";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { AlunosService } from "@/services/alunos.service";
import { MatriculasService } from "@/services/matriculas.service";
import type { Aluno } from "@/types/aluno-types";
import type { Matricula } from "@/types/matricula-types";
import type { Turma } from "@/types/turma-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  Trash2,
  Eye,
  Users,
  //  ClipboardPlus,
} from "lucide-react";
import ModalTurma from "./modal-turma";
import { AnoSerie, Turno } from "@/types/turma-types";
import { useEffect, useState } from "react";

export function Turmas() {
  const { turmas, handleDelete, handleEdit } = useTurmas();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [turmaVisualizada, setTurmaVisualizada] = useState<Turma | null>(null);

  // const { calendarios } = useCalendarios();
  // const [selectedCalendario, setSelectedCalendario] =
  //   useState("");
  const { escolas } = useEscolas();

  useEffect(() => {
    AlunosService.getAll()
      .then((data) => setAlunos(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Erro ao carregar alunos:", error));

    MatriculasService.getAll()
      .then((data) => setMatriculas(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Erro ao carregar matrículas:", error));
  }, []);

  const getEscolaName = (escolaId: string) => {
    const escola = escolas.find((e) => e.id === escolaId);
    return escola ? escola.nome : "Escola não encontrada";
  }

  const alunosDaTurma = turmaVisualizada
    ? alunos.filter((aluno) => matriculas.some(
      (matricula) => matricula.alunoId === aluno.id
        && matricula.turmaId === turmaVisualizada.id
        && matricula.ativo !== false,
    ))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Turmas
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie as turmas das escolas
          </p>
        </div>
        <div>
          <ModalTurma />
        </div>

      </div>

      {/* Filtros */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Selecione o calendário</CardTitle>
        </CardHeader>
         <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-row gap-4">
              <Label htmlFor="calendario">
                Calendário/Ano*
              </Label>
              <Select
                value={selectedCalendario}
                onValueChange={setSelectedCalendario}
              >
                <SelectTrigger className="min-w-[250px]">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {calendarios
                    .filter((c) => c.ativo)
                    .map((calendario) => (
                      <SelectItem
                        key={calendario.id}
                        value={calendario.id}
                      >
                        {calendario.ano}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent> 
      </Card> */}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Turmas Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {turmas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma turma cadastrada</p>
              <p className="text-sm mt-2">
                Clique em "Nova Turma" para começar
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano/Série</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Representante</TableHead>
                  <TableHead className="text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turmas.map((turma) => (
                  <TableRow key={turma.id}>
                    <TableCell className="font-medium">
                      {turma.nome}
                    </TableCell>
                    <TableCell>{(AnoSerie as any)[turma.anoEscolar] ?? turma.anoEscolar}</TableCell>
                    <TableCell>
                      {getEscolaName(turma.escolaId)}
                    </TableCell>
                    <TableCell>{(Turno as any)[turma.turno] ?? turma.turno}</TableCell>
                    <TableCell>{turma.representanteNome}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(turma)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTurmaVisualizada(turma)}
                          title="Ver alunos da turma"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(turma.id)}
                        >
                          <ClipboardPlus className="h-4 w-4" />
                        </Button> */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(turma.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={Boolean(turmaVisualizada)} onOpenChange={(open) => !open && setTurmaVisualizada(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Alunos da turma {turmaVisualizada?.nome}
            </DialogTitle>
          </DialogHeader>
          {alunosDaTurma.length === 0 ? (
            <p className="py-6 text-center text-gray-500">Nenhum aluno vinculado a esta turma.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunosDaTurma.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">{aluno.nome}</TableCell>
                    <TableCell>{new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
