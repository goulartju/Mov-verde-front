import React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useUsuarios } from "./UsuariosContext";
import { parseStringToDate } from "@/lib/datetime-utils";
import DatePicker from "@/components/ui/date-picker";
import { format } from "date-fns";
import { UsuarioPermissao } from "@/types/usuario-types";

const ModalUsuario = () => {
  const { addUsuario, updateUsuario, editingId, setEditingId, openModal, setOpenModal,
    usuarioSelected, setUsuarioSelected, setUsuarios } = useUsuarios();


  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    permissao: 0,
    cargo: "",
    ativo: true,
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      dataNascimento: "",
      email: "",
      permissao: 0,
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
    let usuario;
    if (editingId) {
      usuario = updateUsuario(editingId, formData);
      toast.success("Usuário atualizado com sucesso!");
    } else {
      usuario = addUsuario(formData);
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
          permissao: usuarioSelected.permissao || 0,
          cargo: usuarioSelected.cargo || "",
          ativo: usuarioSelected.ativo ?? true,
          email: usuarioSelected.email || "",
        });
      } else {
        setFormData({
          nome: "",
          dataNascimento: "",
          permissao: 0,
          cargo: "",
          ativo: true,
          email: "",
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
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              placeholder="Digite o nome do usuário"
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              placeholder="Digite um email válido"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-row space-y-4 gap-4">
            <div className="flex-1 flex-col">
              <Label>
                Data de nascimento <span className="text-red-500">*</span>
              </Label>
              <DatePicker
                value={parseStringToDate(formData.dataNascimento)}
                label=""
                onChange={(date: Date | undefined) => setFormData({ ...formData, dataNascimento: date ? format(date, 'yyyy-MM-dd') : '' })}
              />
            </div>
            <div className="flex-1 flex-col">
              <Label htmlFor="turno">Permissão *</Label>
              <Select
                value={formData.permissao.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, permissao: parseInt(value) })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a permissão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.keys(UsuarioPermissao)
                      .filter((key) => isNaN(Number(key)))
                      .map((key) => (
                        <SelectItem
                          key={key}
                          value={UsuarioPermissao[key as keyof typeof UsuarioPermissao].toString()}
                        >
                          {key}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
          <div className="flex justify-end">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="ativo">Ativo</Label>
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
              />
            </div>
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