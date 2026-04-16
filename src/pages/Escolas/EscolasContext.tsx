import { createContext, useContext, useState, useEffect, type ReactNode, use } from 'react';
import { toast } from 'sonner';
import type { Escola } from "@/types/escola-types"
import { EscolasService } from '@/services/escolas.service';


interface EscolasContextType {
  escolas: Escola[];
  escolaSelected: Escola | null;
  setEscolaSelected: (escola: Escola | null) => void;
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
  const [escolaSelected, setEscolaSelected] = useState<Escola | null>(null);

  const fetchEscolas = async () => {
    try {
      const data = await EscolasService.getAll();
      setEscolas(data);
    } catch (error) {
      toast.error("Erro ao carregar escolas. Tente novamente.");
    }
  };

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
    setEscolaSelected(escolas.find(e => e.id === id) || null);
  };

  const deleteEscola = (id: string) => {
    setEscolas(prev => prev.filter(e => e.id !== id));
    if (escolaSelected?.id === id) {
      setEscolaSelected(null);
    }
  };

  const handleEdit = (escola: Escola) => {
    setEditingId(escola.id);
    setEscolaSelected(escola);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await EscolasService.delete(id);
      deleteEscola(id);
      toast.success("Escola excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir escola. Tente novamente.");
      console.error("Erro ao excluir escola:", error);
    }
  };

  useEffect(() => {
    fetchEscolas();
  }, []);

  return (
    <EscolasContext.Provider value={{ escolas, escolaSelected, setEscolaSelected, addEscola, updateEscola, deleteEscola, editingId, setEditingId, openModal, setOpenModal, handleEdit, handleDelete }}>
      {children}
    </EscolasContext.Provider>
  );
};
