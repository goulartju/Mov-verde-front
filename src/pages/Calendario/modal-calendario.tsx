import React from "react";
import { useCalendarios } from "./CalendariosContext";
import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEscolas } from "../Escolas/EscolasContext";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import DatePicker from "@/components/ui/date-picker";
import { toast } from "sonner";


const ModalCalendario = () => {
  const { addCalendario, updateCalendario, editingId, setEditingId, openModal, setOpenModal, setCalendarioSelected,
    calendarioSelected } = useCalendarios();
  const { escolas } = useEscolas();

  const [formData, setFormData] = useState({
    ano: new Date().getFullYear(),
    dataInicio: "",
    dataFim: "",
    ativo: true,
    id: "",
    escolaId: "",
  });

  // Helper para parsear datas em formato yyyy-MM-dd ou ISO string
  const parseStringToDate = (dateString: string | undefined | Date): Date | undefined => {
    if (!dateString) return undefined;

    try {
      // Se já for uma Date, retorna como está
      if (dateString instanceof Date) {
        return dateString;
      }

      // Tenta parsear como ISO string primeiro (YYYY-MM-DD ou ISO completo)
      if (typeof dateString === 'string') {
        // Se for formato yyyy-MM-dd
        if (dateString.length === 10 && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return parse(dateString, 'yyyy-MM-dd', new Date());
        }

        // Se for ISO completo (2026-04-20T00:00:00...)
        if (dateString.includes('T')) {
          return new Date(dateString);
        }

        // Tenta parsear como ISO
        const parsed = new Date(dateString);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }

      return undefined;
    } catch (error) {
      console.error('Erro ao parsear data:', error, dateString);
      return undefined;
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação de campos obrigatórios
    const errors: string[] = [];

    if (!formData.escolaId) errors.push("Escola");
    if (!formData.dataInicio || formData.dataInicio.trim() === "") errors.push("Data de início");
    if (!formData.dataFim || formData.dataFim.trim() === "") errors.push("Data de término");

    if (errors.length > 0) {
      toast.error(`Campos obrigatórios não preenchidos: ${errors.join(", ")}`);
      return;
    }

    if (editingId) {
      updateCalendario(editingId, formData);
      toast.success("Calendário atualizado com sucesso!");
    } else {
      addCalendario(formData);
      toast.success("Calendário criado com sucesso!");
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      ano: new Date().getFullYear(),
      dataInicio: "",
      dataFim: "",
      ativo: true,
      id: "",
      escolaId: "",
    });
    setEditingId(null);
    setCalendarioSelected(null);
    setOpenModal(false);
  };

  useEffect(() => {
    if (openModal) {
      if (editingId && calendarioSelected) {
        setFormData({
          ano: calendarioSelected.ano || new Date().getFullYear(),
          dataInicio: calendarioSelected.dataInicio || "",
          dataFim: calendarioSelected.dataFim || "",
          ativo: calendarioSelected.ativo ?? true,
          id: calendarioSelected.id || "",
          escolaId: calendarioSelected.escolaId || "",
        });
      } else {
        setFormData({
          ano: new Date().getFullYear(),
          dataInicio: "",
          dataFim: "",
          ativo: true,
          id: "",
          escolaId: "",
        });
      }
    }
  }, [openModal, editingId, calendarioSelected]);

  return (
    <Dialog open={openModal} onOpenChange={(isOpen) => {
      setOpenModal(isOpen);
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
          <div className="flex flex-col w-full gap-4">
            <div className={"flex flex-col "}>
              <Label htmlFor="ano">
                Ano <span className="text-red-500">*</span>
              </Label>
              <Input
                id="ano"
                type="number"
                value={formData.ano}
                onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) || new Date().getFullYear() })}
                required
              />
            </div>
            <div className={"flex flex-col w-full min-w-[300px]"}>
              <Label htmlFor="escolaId">
                Escola <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.escolaId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    escolaId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a escola" />
                </SelectTrigger>
                <SelectContent>
                  {escolas.map((escola) => (
                    <SelectItem
                      key={escola.id}
                      value={escola.id}
                    >
                      {escola.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={"flex flex-row w-full gap-4"}>
              <div>
                <Label>
                  Data de início <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={parseStringToDate(formData.dataInicio)}
                  label=""
                  onChange={(date: Date | undefined) => setFormData({ ...formData, dataInicio: date ? format(date, 'yyyy-MM-dd') : '' })}
                />
              </div>
              <div>
                <Label>
                  Data de término <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  value={parseStringToDate(formData.dataFim)}
                  label=""
                  onChange={(date: Date | undefined) => setFormData({ ...formData, dataFim: date ? format(date, 'yyyy-MM-dd') : '' })}
                />
              </div>
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
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary">
                {editingId ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCalendario;