import { useState } from "react";
import { useData } from "../context/DataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  ClipboardPlus,
} from "lucide-react";
import { toast } from "sonner";

export function Turmas() {
  const {
    turmas,
    escolas,
    usuarios,
    addTurma,
    updateTurma,
    calendarios,
    deleteTurma,
  } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null,
  );
  const [selectedCalendario, setSelectedCalendario] =
    useState("");
  const [selectedRepresentante, setSelectedRepresentante] =
    useState("");

  const [formData, setFormData] = useState({
    nome: "",
    ano: "",
    escolaId: "",
    turno: "",
    calendario: "",
    representante: ""
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      ano: "",
      escolaId: "",
      turno: "",
      calendario: "",
      representante: ""
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nome

    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateTurma(editingId, formData);
      toast.success("Turma atualizada com sucesso!");
    } else {
      addTurma(formData);
      toast.success("Turma criada com sucesso!");
    }

    setOpen(false);
    resetForm();
  };

  const handleEdit = (turma: any) => {
    setFormData({
      nome: turma.nome,
      ano: turma.ano,
      escolaId: turma.escolaId,
      turno: turma.turno,
      calendario: turma.calendario,
      representante: turma.representante
    });
    setEditingId(turma.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta turma?")) {
      deleteTurma(id);
      toast.success("Turma excluída com sucesso!");
    }
  };

  const getEscolaName = (escolaId: string) => {
    const escola = escolas.find((e) => e.id === escolaId);
    return escola ? escola.nome : "Escola não encontrada";
  };

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
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Turma" : "Nova Turma"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="escolaId">Escola *</Label>
                <Select
                  value={formData.escolaId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      escolaId: value,
                    })
                  }

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
                <Label htmlFor="nome">Nome da Turma *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nome: e.target.value,
                    })
                  }

                  placeholder="Ex: Turma A, 5º Ano A"
                />
              </div>
              <div>
                <Label htmlFor="ano">Ano/Série *</Label>
                <Select
                  value={formData.ano}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ano: value })
                  }

                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1º Ano">
                      1º Ano
                    </SelectItem>
                    <SelectItem value="2º Ano">
                      2º Ano
                    </SelectItem>
                    <SelectItem value="3º Ano">
                      3º Ano
                    </SelectItem>
                    <SelectItem value="4º Ano">
                      4º Ano
                    </SelectItem>
                    <SelectItem value="5º Ano">
                      5º Ano
                    </SelectItem>
                    <SelectItem value="6º Ano">
                      6º Ano
                    </SelectItem>
                    <SelectItem value="7º Ano">
                      7º Ano
                    </SelectItem>
                    <SelectItem value="8º Ano">
                      8º Ano
                    </SelectItem>
                    <SelectItem value="9º Ano">
                      9º Ano
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="turno">Turno *</Label>
                <Select
                  value={formData.turno}
                  onValueChange={(value) =>
                    setFormData({ ...formData, turno: value })
                  }

                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matutino">
                      Matutino
                    </SelectItem>
                    <SelectItem value="Vespertino">
                      Vespertino
                    </SelectItem>
                    <SelectItem value="Noturno">
                      Noturno
                    </SelectItem>
                    <SelectItem value="Integral">
                      Integral
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="calendario">Calendário *</Label>
                <Select
                  value={formData.calendario}
                  onValueChange={(value) =>
                    setFormData({ ...formData, calendario: value })
                  }

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
                <Label htmlFor="escolaRepresentante">Representante *</Label>
                <Select
                  value={formData.representante}
                  onValueChange={(value) =>
                    setFormData({ ...formData, representante: value })
                  }

                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o representante da turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios
                      .filter((c) => c.ativo)
                      .map((usuario) => (
                        <SelectItem
                          key={usuario.id}
                          value={usuario.nome}
                        >
                          {usuario.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
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
      </Card>

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
                    <TableCell>{turma.ano}</TableCell>
                    <TableCell>
                      {getEscolaName(turma.escolaId)}
                    </TableCell>
                    <TableCell>{turma.turno}</TableCell>
                    <TableCell>{turma.representante}</TableCell>
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
                          onClick={() => handleDelete(turma.id)}
                        >
                          <ClipboardPlus className="h-4 w-4" />
                        </Button>
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
    </div>
  );
}