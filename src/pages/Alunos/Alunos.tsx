

import { useState } from "react";
import { useAlunos } from "./AlunosContext";
import { useTurmas } from "@/pages/Turmas/TurmasContext";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { useCalendarios } from "@/pages/Calendario/CalendariosContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export function Alunos() {
  const { alunos, addAluno, updateAluno, deleteAluno } = useAlunos();
  const { turmas } = useTurmas();
  const { escolas } = useEscolas();
  const { calendarios } = useCalendarios();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );
  const [selectedEscola, setSelectedEscola] = useState("");
  const [selectedTurma, setSelectedTurma] = useState("");
  const [selectedCalendario, setSelectedCalendario] =
    useState("");
  const [formData, setFormData] = useState({
    nome: "",
    turmaId: "",
    dataNascimento: "",
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      turmaId: "",
      dataNascimento: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.dataNascimento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateAluno(editingId, formData);
      toast.success("Aluno atualizado com sucesso!");
    } else {
      addAluno(formData);
      toast.success("Aluno criado com sucesso!");
    }

    setOpen(false);
    resetForm();
  };

  const handleEdit = (aluno: any) => {
    setFormData({
      nome: aluno.nome,
      turmaId: selectedTurma,
      dataNascimento: aluno.dataNascimento,
    });
    setEditingId(aluno.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      deleteAluno(id);
      toast.success("Aluno excluído com sucesso!");
    }
  };

  const getTurmaInfo = (turmaId: string) => {
    const turma = turmas.find((t) => t.id === turmaId);
    if (!turma) return "Turma não encontrada";

    const escola = escolas.find((e) => e.id === turma.escolaId);
    return `${turma.nome} - ${escola?.nome || "Escola não encontrada"}`;
  };

  const getTurmaNome = (turmaId: string) => {
    const turma = turmas.find((t) => t.id === turmaId);
    return turma ? turma.nome : "Turma não encontrada";
  };

  const turmasFiltradas = turmas.filter(
    (t) => t.escolaId === selectedEscola,
  );
  const alunosFiltrados = alunos.filter(
    (a) => a.turmaId === selectedTurma,
  );

  const handleEscolaChange = (escolaId: string) => {
    setSelectedEscola(escolaId);
    setSelectedTurma("");
  };

  const handleTurmaChange = (turmaId: string) => {
    setSelectedTurma(turmaId);
  };
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
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Aluno" : "Novo Aluno"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nome: e.target.value,
                    })
                  }
                  required
                  placeholder="Nome do aluno"
                />
              </div>
              <div>
                <Label htmlFor="dataNascimento">
                  Data de Nascimento *
                </Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dataNascimento: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione a Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </Card>

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
                  <TableHead>Turma</TableHead>
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
                    <TableCell>
                      {getTurmaInfo(aluno.turmaId)}
                    </TableCell>
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