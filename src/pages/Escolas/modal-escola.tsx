import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEscolas } from "./EscolasContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import type { Escola } from "@/types/escola-types";

const ModalEscola = () => {
  const { addEscola, updateEscola, editingId, setEditingId, openModal, setOpenModal, escolaSelected, setEscolaSelected } = useEscolas();

  const [formData, setFormData] = useState({
    nome: "",
    municipio: "",
    contato: "",
    diretor: "",
    ativo: true,
  });

  // Atualiza formData ao abrir modal para editar ou criar
  useEffect(() => {
    if (openModal) {
      if (editingId && escolaSelected) {
        setFormData({
          nome: escolaSelected.nome || "",
          municipio: escolaSelected.municipio || "",
          contato: escolaSelected.contato || "",
          diretor: escolaSelected.diretor || "",
          ativo: escolaSelected.ativo ?? true,
        });
      } else {
        setFormData({
          nome: "",
          municipio: "",
          contato: "",
          diretor: "",
          ativo: true,
        });
      }
    }
  }, [openModal, editingId, escolaSelected]);

  const resetForm = () => {
    setFormData({
      nome: "",
      contato: "",
      municipio: "",
      diretor: "",
      ativo: true,
    });
    setEditingId(null);
    setEscolaSelected(null);
    setOpenModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.municipio || !formData.diretor || !formData.contato) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      updateEscola(editingId, formData);
      toast.success("Escola atualizada com sucesso!");
    } else {
      await addEscola(formData);
      toast.success("Escola criada com sucesso!");
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
            <Label htmlFor="municipio">Município*</Label>
            <Input
              id="municipio"
              value={formData.municipio}
              onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
              required
              placeholder="Digite o nome do município"
            />
          </div>
          <div>
            <Label htmlFor="diretor">Diretor(a) *</Label>
            <Input
              id="diretor"
              value={formData.diretor}
              onChange={(e) => setFormData({ ...formData, diretor: e.target.value })}
              required
              placeholder="Digite o nome do(a) diretor(a)"
            />
          </div>
          <div>
            <Label htmlFor="contato">Contato*</Label>
            <Input
              id="contato"
              value={formData.contato}
              onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
              required
              placeholder="Digite o contato"
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

export default ModalEscola;