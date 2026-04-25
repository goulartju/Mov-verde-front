import React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useUsuarios } from "./UsuariosContext";

const ModalUsuario = () => {
  const { addUsuario, updateUsuario, editingId, setEditingId, openModal, setOpenModal, usuarioSelected, setUsuarioSelected } = useUsuarios();


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
    setOpenModal(false);
    setUsuarioSelected(null);
  };



  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    const errors: string[] = [];

    if (!formData.nome) errors.push("Nome");
    if (!formData.dataNascimento || formData.dataNascimento.trim() === "") errors.push("Data de nascimento");
    if (!formData.permissao) errors.push("Permissão");
    if (!formData.cargo) errors.push("Cargo");

    if (errors.length > 0) {
      toast.error(`Campos obrigatórios não preenchidos: ${errors.join(", ")}`);
      return;
    }

    if (editingId) {
      updateUsuario(editingId, formData);
      toast.success("Usuário atualizado com sucesso!");
    } else {
      addUsuario(formData);
      toast.success("Usuário criado com sucesso!");
    }

    resetForm();
  }

  useEffect(() => {
    if (openModal) {
      if (editingId && usuarioSelected) {
        setFormData({
          nome: usuarioSelected.nome || "",
          dataNascimento: usuarioSelected.dataNascimento || "",
          permissao: usuarioSelected.permissao || "",
          cargo: usuarioSelected.cargo || "",
          ativo: usuarioSelected.ativo ?? true,
        });
      } else {
        setFormData({
          nome: "",
          dataNascimento: "",
          permissao: "",
          cargo: "",
          ativo: true,
        });
      }
    }
  }, [openModal, editingId, usuarioSelected]);



  return (
    <Dialog open={openModal} onOpenChange={(isOpen) => {
      setOpenModal(isOpen);
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
            <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
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

export default ModalUsuario;