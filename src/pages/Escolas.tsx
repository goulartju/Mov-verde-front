import { useState } from "react";
import { useData } from "../context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Plus, Pencil, Trash2, School } from "lucide-react";
import { toast } from "sonner";

export function Escolas() {
  const { escolas, addEscola, updateEscola, deleteEscola } = useData();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    contato: "",
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      endereco: "",
      contato: "",
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.endereco) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateEscola(editingId, formData);
      toast.success("Escola atualizada com sucesso!");
    } else {
      addEscola(formData);
      toast.success("Escola criada com sucesso!");
    }

    setOpen(false);
    resetForm();
  };

  const handleEdit = (escola: any) => {
    setFormData({
      nome: escola.nome,
      endereco: escola.endereco,
      contato: escola.contato,
    });
    setEditingId(escola.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta escola?")) {
      deleteEscola(id);
      toast.success("Escola excluída com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Escolas</h1>
          <p className="text-gray-500 mt-1">Gerencie as escolas participantes</p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Escola
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Escola" : "Nova Escola"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Escola *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  placeholder="Ex: Escola Municipal João Silva"
                />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  required
                  placeholder="Rua, número, bairro, cidade"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="contato">Contato</Label>
                <Input
                  id="contato"
                  value={formData.contato}
                  onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                  placeholder="Telefone ou e-mail"
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
            <School className="h-5 w-5" />
            Escolas Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {escolas.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <School className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma escola cadastrada</p>
              <p className="text-sm mt-2">Clique em "Nova Escola" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escolas.map((escola) => (
                  <TableRow key={escola.id}>
                    <TableCell className="font-medium">{escola.nome}</TableCell>
                    <TableCell>{escola.endereco}</TableCell>
                    <TableCell>{escola.contato || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(escola)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(escola.id)}
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
