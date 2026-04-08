import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { Escola } from "@/types/escola-types"
import { EscolasService } from '@/services/escolas.service';


interface EscolasContextType {
  escolas: Escola[];
  addEscola: (escola: Omit<Escola, 'id'>) => Promise<void>;
  updateEscola: (id: string, escola: Partial<Escola>) => void;
  deleteEscola: (id: string) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  handleEdit: (escola: Escola) => void;
  handleDelete: (id: string) => void;
}

const EscolasContext = createContext<EscolasContextType | undefined>(undefined);

export const useEscolas = () => {
  const context = useContext(EscolasContext);
  if (!context) throw new Error('useEscolas must be used within EscolasProvider');
  return context;
};

export const EscolasProvider = ({ children }: { children: ReactNode }) => {
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);



  const addEscola = async (escola: Omit<Escola, 'id'>) => {
    try {
      const newEscola = await EscolasService.create(escola);
      setEscolas(prev => [...prev, newEscola]);
    } catch (error) {
      toast.error("Erro ao criar escola. Tente novamente.");
    }
  };

  const updateEscola = (id: string, escola: Partial<Escola>) => {
    setEscolas(prev => prev.map(e => e.id === id ? { ...e, ...escola } : e));
  };

  const deleteEscola = (id: string) => {
    setEscolas(prev => prev.filter(e => e.id !== id));
  };

  const handleEdit = (escola: Escola) => {
    setEditingId(escola.id);
    setOpenModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta escola?")) {
      deleteEscola(id);
      toast.success("Escola excluída com sucesso!");
    }
  };

  return (
    <EscolasContext.Provider value={{ escolas, addEscola, updateEscola, deleteEscola, editingId, setEditingId, openModal, setOpenModal, handleEdit, handleDelete }}>
      {children}
    </EscolasContext.Provider>
  );
};
