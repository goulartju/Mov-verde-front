import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup } from "@/components/ui/select";
import { Turno, AnoSerie } from "@/types/turma-types";
import { useTurmas } from "./TurmasContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useCalendarios } from "@/pages/Calendario/CalendariosContext";
import { useEscolas } from "@/pages/Escolas/EscolasContext";
import { useUsuarios } from "@/pages/Administrativo/UsuariosContext";

const ModalTurma = () => {
  const { addTurma, updateTurma, editingId, setEditingId, openModal, setOpenModal, turmaSelected, setTurmaSelected } = useTurmas();
  const { calendarios } = useCalendarios();
  const { escolas } = useEscolas();
  const { usuarios } = useUsuarios();
  const usuariosList = Array.isArray(usuarios) ? usuarios : Object.values(usuarios ?? {});

  const [formData, setFormData] = useState({
    nome: "",
    anoEscolar: "",
    escolaId: "",
    turno: "",
    calendarioId: "",
    representanteId: "",
    ativo: true,
  });

  // Atualiza formData ao abrir modal para editar ou criar
  useEffect(() => {
    if (openModal) {
      if (editingId && turmaSelected) {
        const anoKey = Object.entries(AnoSerie).find(([, v]) => v === turmaSelected.anoEscolar)?.[0] ?? turmaSelected.anoEscolar;
        const turnoKey = Object.entries(Turno).find(([, v]) => v === turmaSelected.turno)?.[0] ?? turmaSelected.turno;
        setFormData({
          nome: turmaSelected.nome || "",
          anoEscolar: anoKey || "",
          escolaId: turmaSelected.escolaId || "",
          turno: turnoKey || "",
          calendarioId: turmaSelected.calendarioId || "",
          representanteId: turmaSelected.representanteId || "",
          ativo: turmaSelected.ativo ?? true,
        });
      } else {
        setFormData({
          nome: "",
          anoEscolar: "",
          escolaId: "",
          turno: "",
          calendarioId: "",
          representanteId: "",
          ativo: true
        });
      }
    }
  }, [openModal, editingId, turmaSelected]);

  const resetForm = () => {
    setFormData({
      nome: "",
      anoEscolar: "",
      escolaId: "",
      turno: "",
      calendarioId: "",
      representanteId: "",
      ativo: true,
    });
    setEditingId(null);
    setTurmaSelected(null);
    setOpenModal(false);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.nome || !formData.anoEscolar || !formData.escolaId || !formData.turno || !formData.calendarioId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const payload: any = {
      nome: formData.nome,
      anoEscolar: formData.anoEscolar,
      escolaId: formData.escolaId,
      turno: formData.turno,
      calendarioId: formData.calendarioId,
      ativo: formData.ativo,
    };

    if (formData.representanteId)
      payload.representanteId = formData.representanteId;

    if (editingId) {
      updateTurma(editingId, payload);
      toast.success("Turma atualizada com sucesso!");
    } else {
      addTurma(payload as any);
      toast.success("Turma criada com sucesso!");
    }

    resetForm();
  };

  return (
    <Dialog open={openModal} onOpenChange={(isOpen) => {
      setOpenModal(isOpen);
      if (!isOpen) resetForm();
    }}>
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
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
              placeholder="Ex: Turma A"
            />
          </div>
          <div>
            <Label htmlFor="ano-escolar">Ano/Série*</Label>
            <Select
              value={formData.anoEscolar}
              onValueChange={(value) => setFormData({ ...formData, anoEscolar: value })}
            >
              <SelectTrigger id="ano-escolar">
                <SelectValue placeholder="Selecione o ano/série" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(AnoSerie).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="turno">Turno*</Label>
            <Select
              value={formData.turno}
              onValueChange={(value) => setFormData({ ...formData, turno: value })}
            >
              <SelectTrigger id="turno">
                <SelectValue placeholder="Selecione o turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(Turno).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="calendario">Calendário*</Label>
            <Select
              value={formData.calendarioId}
              onValueChange={(value) => setFormData({ ...formData, calendarioId: value })}
            >
              <SelectTrigger id="calendario">
                <SelectValue placeholder="Selecione o calendário" />
              </SelectTrigger>
              <SelectContent>
                {calendarios
                  .filter((c) => c.ativo)
                  .map((calendario) => (
                    <SelectItem key={calendario.id} value={calendario.id}>
                      {calendario.ano}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="escolaId">Escola*</Label>
            <Select
              value={formData.escolaId}
              onValueChange={(value) => setFormData({ ...formData, escolaId: value })}
            >
              <SelectTrigger id="escolaId">
                <SelectValue placeholder="Selecione a escola" />
              </SelectTrigger>
              <SelectContent>
                {escolas
                  .filter((e) => e.ativo)
                  .map((escola) => (
                    <SelectItem key={escola.id} value={escola.id}>
                      {escola.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="representante">Representante</Label>
            <Select
              value={formData.representanteId}
              onValueChange={(value) => setFormData({ ...formData, representanteId: value })}
            >
              <SelectTrigger id="representante">
                <SelectValue placeholder="Selecione o representante" />
              </SelectTrigger>
              <SelectContent>
                {usuariosList
                  .filter((u: any) => u.ativo)
                  .map((usuario: any) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      {usuario.nome}
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
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => resetForm()}>
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
}

export default ModalTurma;