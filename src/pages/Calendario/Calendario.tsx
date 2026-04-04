import { useState, useEffect } from "react";
import { useCalendarios } from "./CalendariosContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import DatePicker from "@/components/ui/date-picker";
import { CalendariosService } from '@/services/calendarios.service';
export function Calendario() {
  const { calendarios, addCalendario, updateCalendario, deleteCalendario } = useCalendarios();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);



  useEffect(() => {
    CalendariosService.logAll();
  }, []);

  const [formData, setFormData] = useState({
    ano: new Date().getFullYear(),
    dataInicio: "",
    dataFim: "",
    ativo: true,
  });

  const resetForm = () => {
    setFormData({
      ano: new Date().getFullYear(),
      dataInicio: "",
      dataFim: "",
      ativo: true,
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dataInicio || !formData.dataFim) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateCalendario(editingId, formData);
      toast.success("Calendário atualizado com sucesso!");
    } else {
      addCalendario(formData);
      toast.success("Calendário criado com sucesso!");
    }

    setOpen(false);
    resetForm();
  };

  const handleEdit = (calendario: any) => {
    setFormData({
      ano: calendario.ano,
      dataInicio: calendario.dataInicio,
      dataFim: calendario.dataFim,
      ativo: calendario.ativo,
    });
    setEditingId(calendario.id);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este calendário?")) {
      deleteCalendario(id);
      toast.success("Calendário excluído com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendário</h1>
          <p className="text-gray-500 mt-1">Gerencie os períodos de arrecadação</p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary ">
              <Plus className="h-4 w-4 mr-2" />
              Novo Calendário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Calendário" : "Novo Calendário"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex gap-4">
                <DatePicker
                  date={formData.dataInicio ? new Date(formData.dataInicio) : undefined}
                  label="Data de início"
                  onDateChange={(date: Date | undefined) => setFormData({ ...formData, dataInicio: date ? date.toISOString().split('T')[0] : '' })}
                />
                <DatePicker
                  date={formData.dataFim ? new Date(formData.dataFim) : undefined}
                  label="Data de término"
                  onDateChange={(date: Date | undefined) => setFormData({ ...formData, dataFim: date ? date.toISOString().split('T')[0] : '' })}
                />
              </div>


              <div className="flex justify-end gap-4 items-center">
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
                <Button type="submit" className="bg-primary">
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
            Calendários Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {calendarios.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum calendário cadastrado</p>
              <p className="text-sm mt-2">Clique em "Novo Calendário" para começar</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ano</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Término</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calendarios.map((calendario) => (
                  <TableRow key={calendario.id}>
                    <TableCell className="font-medium">{calendario.ano}</TableCell>
                    <TableCell>
                      {new Date(calendario.dataInicio).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {new Date(calendario.dataFim).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${calendario.ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {calendario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(calendario)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(calendario.id)}
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
