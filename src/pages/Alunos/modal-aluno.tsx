import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useAlunos } from "@/pages/Alunos/AlunosContext";
import DatePicker from "@/components/ui/date-picker";
import { parseStringToDate } from "@/lib/datetime-utils";
import { format } from "date-fns";


const ModalAluno = () => {
  const { editingId, setEditingId, openModal, setOpenModal, addAluno, updateAluno, alunoSelected } = useAlunos();

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    ativo: true,
  });

  // Atualiza formData ao abrir modal para editar ou criar
  useEffect(() => {
    if (openModal) {
      if (editingId) {
        setFormData({
          nome: alunoSelected?.nome || "",
          dataNascimento: alunoSelected?.dataNascimento || "",
          ativo: alunoSelected?.ativo ?? true,
        });
      } else {
        setFormData({
          nome: "",
          dataNascimento: "",
          ativo: true
        });
      }
    }
  }, [openModal, editingId]);

  const resetForm = () => {
    setFormData({
      nome: "",
      dataNascimento: "",
      ativo: true,
    });
    setEditingId(null);
    setOpenModal(false);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome || !formData.dataNascimento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const payload: any = {
      nome: formData.nome,
      dataNascimento: formData.dataNascimento,
      ativo: formData.ativo
    };

    if (editingId) {
      updateAluno(editingId, payload);
      toast.success("Aluno atualizado com sucesso!");
    } else {
      addAluno(payload as any);
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
            <Label>
              Data de início <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={parseStringToDate(formData.dataNascimento)}
              label=""
              onChange={(date: Date | undefined) => setFormData({ ...formData, dataNascimento: date ? format(date, 'yyyy-MM-dd') : '' })}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenModal(false)}
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
  );
};

export default ModalAluno;