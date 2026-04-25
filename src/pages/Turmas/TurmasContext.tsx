import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Turma } from '@/types/turma-types';
import { toast } from 'sonner';
import { TurmasService } from '@/services/turmas.service';


interface TurmasContextType {
  turmas: Turma[];
  editingId: string | null;
  openModal: boolean;
  turmaSelected: Turma | null;
  setTurmaSelected: (turma: Turma | null) => void;
  addTurma: (turma: Omit<Turma, 'id'>) => Promise<void>;
  updateTurma: (id: string, turma: Partial<Turma>) => void;
  setEditingId: (id: string | null) => void;
  setOpenModal: (open: boolean) => void;
  handleEdit: (turma: Turma) => void;
  handleDelete: (id: string) => void;
}

const TurmasContext = createContext<TurmasContextType | undefined>(undefined);

export const useTurmas = () => {
  const context = useContext(TurmasContext);
  if (!context) throw new Error('useTurmas must be used within TurmasProvider');
  return context;
};

export const TurmasProvider = ({ children }: { children: ReactNode }) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [turmaSelected, setTurmaSelected] = useState<Turma | null>(null);

  const fetchTurmas = async () => {
    try {
      const data = await TurmasService.getAll();
      setTurmas(data);
    } catch (error) {
      toast.error("Erro ao carregar turmas  . Tente novamente.");
    }
  };

  const addTurma = async (turma: Omit<Turma, 'id'>) => {
    try {
      const newTurma = await TurmasService.create(turma);
      setTurmas(prev => [...prev, newTurma]);
    } catch (error) {
      toast.error("Erro ao criar turma. Tente novamente.");
    }
  };

  const updateTurma = async (id: string, turma: Partial<Turma>) => {
    try {
      const updatedTurma = await TurmasService.update(id, turma);
      setTurmas(prev => prev.map(t => t.id === id ? { ...t, ...updatedTurma } : t));
      setTurmaSelected(turmas.find(t => t.id === id) || null);
    } catch (error) {
      toast.error("Erro ao atualizar turma. Tente novamente.");

    }
  };

  const handleEdit = (turma: Turma) => {
    setEditingId(turma.id);
    setTurmaSelected(turma);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await TurmasService.delete(id);
      setTurmas(prev => prev.filter(t => t.id !== id));
      if (turmaSelected?.id === id) {
        setTurmaSelected(null);
      }
      toast.success("Turma excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir turma. Tente novamente.");
      console.error("Erro ao excluir turma:", error);
    }

  };

  useEffect(() => {
    fetchTurmas();
  }, []);

  return (
    <TurmasContext.Provider
      value={{
        turmas,
        addTurma,
        updateTurma,
        handleDelete,
        handleEdit,
        editingId,
        setEditingId,
        openModal,
        setOpenModal,
        turmaSelected,
        setTurmaSelected,
      }}
    >
      {children}
    </TurmasContext.Provider>
  );
};

