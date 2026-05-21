
import { toast } from "sonner";
import { CalendariosService } from '@/services/calendarios.service';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Calendario } from '@/types/calendario-types';


interface CalendariosContextType {
  calendarios: Calendario[];
  calendarioSelected: Calendario | null;
  editingId: string | null;
  openModal: boolean;
  escolaSelected: string;
  setEscolaSelected: (escolaId: string) => void;
  setEditingId: (id: string | null) => void;
  setOpenModal: (open: boolean) => void;
  handleEdit: (calendario: Calendario) => void;
  setCalendarioSelected: (calendario: Calendario | null) => void;
  addCalendario: (calendario: Omit<Calendario, 'id'>) => void;
  updateCalendario: (id: string, calendario: Partial<Calendario>) => void;
  handleDelete: (id: string) => void;
}

const CalendariosContext = createContext<CalendariosContextType | undefined>(undefined);

export const useCalendarios = () => {
  const context = useContext(CalendariosContext);
  if (!context) throw new Error('useCalendarios must be used within CalendariosProvider');
  return context;
};

export const CalendariosProvider = ({ children }: { children: ReactNode }) => {
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [calendarioSelected, setCalendarioSelected] = useState<Calendario | null>(null);
  const [escolaSelected, setEscolaSelected] = useState<string>("");

  const fetchCalendarios = async () => {
    try {
      const data = await CalendariosService.getAll();
      setCalendarios(data);
    } catch (error) {
      toast.error("Erro ao carregar calendários. Tente novamente.");
    }
  };

  const addCalendario = async (calendario: Omit<Calendario, 'id'>) => {
    try {
      const newCalendario = await CalendariosService.create(calendario);
      setCalendarios(prev => [...prev, newCalendario]);
    } catch (error) {
      toast.error("Erro ao criar calendário. Tente novamente.");
    }
  };

  const updateCalendario = async (id: string, calendario: Partial<Calendario>) => {
    try {
      const updatedCalendario = await CalendariosService.update(id, calendario);
      setCalendarios(prev => prev.map(c => c.id === id ? { ...c, ...updatedCalendario } : c));
      setCalendarioSelected(calendarios.find(c => c.id === id) || null);
    } catch (error) {
      toast.error("Erro ao atualizar calendário. Tente novamente.");
    }
  };

  const handleEdit = (calendario: Calendario) => {
    setEditingId(calendario.id);
    setCalendarioSelected(calendario);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await CalendariosService.delete(id);
      setCalendarios(prev => prev.filter(c => c.id !== id));
      if (editingId === id) {
        setCalendarioSelected(null);
      }
      toast.success("Calendário excluído com sucesso!");
    }
    catch (error) {
      toast.error("Erro ao excluir calendário.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCalendarios();
  }, []);


  return (
    <CalendariosContext.Provider value={{
      calendarios, escolaSelected, setEscolaSelected, handleDelete, handleEdit, addCalendario, updateCalendario,
      openModal, setOpenModal, editingId, setEditingId, calendarioSelected, setCalendarioSelected
    }}>
      {children}
    </CalendariosContext.Provider>
  );
};
