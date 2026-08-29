import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useAlunos } from "@/pages/Alunos/AlunosContext";
import { useTurmas } from "@/pages/Turmas/TurmasContext";
import type { Aluno } from "@/types/aluno-types";

const ModalAluno = () => {
  const {
    editingId,
    setEditingId,
    openModal,
    setOpenModal,
    addAluno,
    updateAluno,
    alunoSelected,
  } = useAlunos();
  const { turmas } = useTurmas();

  const [formData, setFormData] = useState({
    nome: "",
    turmaId: "",
    ativo: true,
  });

  // Atualiza formData ao abrir modal para editar ou criar
  useEffect(() => {
    if (openModal) {
      if (editingId) {
        setFormData({
          nome: alunoSelected?.nome || "",
          turmaId: alunoSelected?.turmaId || "",
          ativo: alunoSelected?.ativo ?? true,
        });
      } else {
        setFormData({
          nome: "",
          turmaId: "",
          ativo: true,
        });
      }
    }
  }, [openModal, editingId]);

  const resetForm = () => {
    setFormData({
      nome: "",
      turmaId: "",
      ativo: true,
    });
    setEditingId(null);
    setOpenModal(false);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome || !formData.turmaId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const payload: Omit<Aluno, "id"> = {
      nome: formData.nome,
      turmaId: formData.turmaId,
      ativo: formData.ativo,
    };

    if (editingId) {
      updateAluno(editingId, payload);
      toast.success("Aluno atualizado com sucesso!");
    } else {
      addAluno(payload);
      toast.success("Aluno criado com sucesso!");
    }

    resetForm();
  };

  return (
    <Dialog
      open={openModal}
      onOpenChange={(isOpen) => {
        setOpenModal(isOpen);
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
          <DialogTitle>{editingId ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
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
            <Label htmlFor="turma">
              Turma <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.turmaId}
              onValueChange={(turmaId) => setFormData({ ...formData, turmaId })}
            >
              <SelectTrigger id="turma">
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {turmas
                  .filter((turma) => turma.ativo)
                  .map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome} - {turma.anoEscolar}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-4 items-center">
            <Label htmlFor="ativo">Ativo</Label>
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, ativo: checked })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenModal(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editingId ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAluno;
