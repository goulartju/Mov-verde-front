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
import { useState, useEffect, useMemo } from "react";
import { useAlunos } from "@/pages/Alunos/AlunosContext";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { useTurmas } from "@/pages/Turmas/TurmasContext";
import { MatriculasService } from "@/services/matriculas.service";
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
  const { escolas } = useEscolas();

  const [formData, setFormData] = useState({
    nome: "",
    escolaId: "",
    turmaId: "",
    ativo: true,
  });

  const turmasFiltradas = useMemo(
    () =>
      [...turmas]
        .filter(
          (turma) =>
            turma.ativo && (!formData.escolaId || turma.escolaId === formData.escolaId),
        )
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    [formData.escolaId, turmas],
  );

  useEffect(() => {
    if (!openModal) return;

    const carregarDadosEdicao = async () => {
      if (!editingId || !alunoSelected) {
        setFormData({
          nome: "",
          escolaId: "",
          turmaId: "",
          ativo: true,
        });
        return;
      }

      try {
        const matriculas = await MatriculasService.getAll();
        const matriculaAtual =
          matriculas.find(
            (matricula) =>
              matricula.alunoId === alunoSelected.id && matricula.ativo !== false,
          ) ??
          matriculas.find((matricula) => matricula.alunoId === alunoSelected.id) ??
          null;

        const turmaIdAtual = matriculaAtual?.turmaId || alunoSelected.turmaId || "";
        const turmaDoAluno = turmas.find((turma) => turma.id === turmaIdAtual);

        setFormData({
          nome: alunoSelected.nome || "",
          escolaId: turmaDoAluno?.escolaId || "",
          turmaId: turmaIdAtual,
          ativo: alunoSelected.ativo ?? true,
        });
      } catch (error) {
        console.error("Erro ao carregar matrícula do aluno:", error);
        const turmaIdAtual = alunoSelected.turmaId || "";
        const turmaDoAluno = turmas.find((turma) => turma.id === turmaIdAtual);

        setFormData({
          nome: alunoSelected.nome || "",
          escolaId: turmaDoAluno?.escolaId || "",
          turmaId: turmaIdAtual,
          ativo: alunoSelected.ativo ?? true,
        });
      }
    };

    void carregarDadosEdicao();
  }, [openModal, editingId, alunoSelected, turmas]);

  const resetForm = () => {
    setFormData({
      nome: "",
      escolaId: "",
      turmaId: "",
      ativo: true,
    });
    setEditingId(null);
    setOpenModal(false);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome || !formData.escolaId || !formData.turmaId) {
      toast.error("Preencha escola e turma antes de salvar");
      return;
    }

    const payload: Omit<Aluno, "id"> = {
      nome: formData.nome,
      turmaId: formData.turmaId,
      ativo: formData.ativo,
    };

    try {
      if (editingId) {
        await updateAluno(editingId, payload);
        toast.success("Aluno atualizado com sucesso!");
      } else {
        await addAluno(payload);
        toast.success("Aluno criado com sucesso!");
      }

      resetForm();
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      toast.error("Erro ao salvar aluno. Tente novamente.");
    }
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
            <Label htmlFor="escola">
              Escola <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.escolaId}
              onValueChange={(escolaId) =>
                setFormData({ ...formData, escolaId, turmaId: "" })
              }
            >
              <SelectTrigger id="escola">
                <SelectValue placeholder="Selecione a escola" />
              </SelectTrigger>
              <SelectContent>
                {escolas
                  .filter((escola) => escola.ativo)
                  .map((escola) => (
                    <SelectItem key={escola.id} value={escola.id}>
                      {escola.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="turma">
              Turma <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.turmaId}
              onValueChange={(turmaId) => setFormData({ ...formData, turmaId })}
              disabled={!formData.escolaId || turmasFiltradas.length === 0}
            >
              <SelectTrigger id="turma">
                <SelectValue
                  placeholder={
                    formData.escolaId
                      ? "Selecione a turma"
                      : "Primeiro selecione a escola"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {turmasFiltradas.map((turma) => (
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
