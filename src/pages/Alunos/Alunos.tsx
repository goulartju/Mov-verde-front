import { useState } from "react";
import { useAlunos } from "./AlunosContext";
import ModalAluno from "./modal-aluno";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, UserPlus } from "lucide-react";


export function Alunos() {
  const { alunos, handleDelete, handleEdit } = useAlunos();


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Alunos
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie os alunos participantes
          </p>
        </div>
        <ModalAluno />

      </div>

      {/* Filtros */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Selecione a Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-roww-full min-w-[300px] md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="calendario">
                Calendário/Ano *
              </Label>
              <Select
                value={selectedCalendario}
                onValueChange={setSelectedCalendario}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o calendário" />
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

            <div>
              <Label htmlFor="escola">Escola *</Label>
              <Select
                value={selectedEscola}
                onValueChange={handleEscolaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {escolas.map((escola) => (
                    <SelectItem
                      key={escola.id}
                      value={escola.id}
                    >
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
      </Card> */}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Alunos Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alunos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum aluno cadastrado</p>
              <p className="text-sm mt-2">
                Clique em "Novo Aluno" para começar
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  {/* <TableHead>Turma</TableHead> */}
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead className="text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alunos.map((aluno) => (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium">
                      {aluno.nome}
                    </TableCell>
                    {/* <TableCell>
                      {getTurmaInfo(aluno.turmaId)}
                    </TableCell> */}
                    <TableCell>
                      {new Date(
                        aluno.dataNascimento,
                      ).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(aluno)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(aluno.id)}
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
    </div>
  );
}