import { useState } from "react";
import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function Administrativo() {
  const { usuarios, addUsuario, updateUsuario, deleteUsuario } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    permissao: "",
    cargo: "",
    ativo: true,
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      dataNascimento: "",
      permissao: "",
      cargo: "",
      ativo: true,
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.nome) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateUsuario(editingId, formData);
      toast.success("Usuário atualizado com sucesso!");
    } else {
      addUsuario(formData);
      toast.success("Calendário criado com sucesso!");
    }

    setOpen(false);
    resetForm();
  };

  const handleEdit = (usuario: any) => {
    setFormData({
      nome: usuario.nome,
      dataNascimento: usuario.dataNascimento,
      permissao: usuario.permissao,
      cargo: usuario.cargo,
      ativo: usuario.ativo,
    });
    setEditingId(usuario.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUsuario(id);
      toast.success("Usuário excluído com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 mt-1">Gerencie os usuários e suas permissões</p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Usuário" : "Novo Usuário"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="turno">Permissão *</Label>
                <Select
                  value={formData.permissao}
                  onValueChange={(value) =>
                    setFormData({ ...formData, permissao: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a permissão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Editor">
                      Editor
                    </SelectItem>
                    <SelectItem value="Visualizador">
                      Visualizador
                    </SelectItem>
                    <SelectItem value="Administrador">
                      Administrador
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="turno">Cargo *</Label>
                <Select
                  value={formData.cargo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cargo: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">
                      Professor(a)
                    </SelectItem>
                    <SelectItem value="Diretor">
                      Diretor(a)
                    </SelectItem>
                    <SelectItem value="Secretaria">
                      Representante Secretaria de Educação
                    </SelectItem>
                    <SelectItem value="Outro">
                      Outro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ativo">Ativo</Label>
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Usuários Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usuarios.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum usuário cadastrado</p>
              <p className="text-sm mt-2">Clique em "Novo Usuário" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de nascimento</TableHead>
                  <TableHead>Permissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>
                      {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {usuario.permissao}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.ativo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(usuario)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(usuario.id)}
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
