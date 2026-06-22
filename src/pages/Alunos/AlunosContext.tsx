import { AlunosService } from '@/services/alunos.service';
import type { Aluno } from '@/types/aluno-types';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from "sonner";

interface AlunosContextType {
  alunos: Aluno[];
  editingId: string | null;
  openModal: boolean;
  alunoSelected: Aluno | null;
  setAlunoSelected: (aluno: Aluno | null) => void;
  addAluno: (aluno: Omit<Aluno, 'id'>) => Promise<void>;
  updateAluno: (id: string, aluno: Partial<Aluno>) => void;
  setEditingId: (id: string | null) => void;
  setOpenModal: (open: boolean) => void;
  handleEdit: (aluno: Aluno) => void;
  handleDelete: (id: string) => void;
}

const AlunosContext = createContext<AlunosContextType | undefined>(undefined);

export const useAlunos = () => {
  const context = useContext(AlunosContext);
  if (!context) throw new Error('useAlunos must be used within AlunosProvider');
  return context;
};

export const AlunosProvider = ({ children }: { children: ReactNode }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [alunoSelected, setAlunoSelected] = useState<Aluno | null>(null);

  const fetchAlunos = async () => {
    try {
      const data = await AlunosService.getAll();
      setAlunos(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Erro ao carregar alunos. Tente novamente.");
    }
  };

  const addAluno = async (aluno: Omit<Aluno, 'id'>) => {
    try {
      const newAluno = await AlunosService.create(aluno);
      setAlunos(prev => [...prev, newAluno]);
    } catch (error) {
      toast.error("Erro ao criar aluno. Tente novamente.");
    }
  };

  const updateAluno = async (id: string, aluno: Partial<Aluno>) => {
    try {
      const updatedAluno = await AlunosService.update(id, aluno);
      setAlunos(prev => prev.map(a => a.id === id ? { ...a, ...updatedAluno } : a));
      setAlunoSelected(alunos.find(a => a.id === id) || null);
    } catch (error) {
      toast.error("Erro ao atualizar aluno. Tente novamente.");

    }
  };

  const handleEdit = (aluno: Aluno) => {
    setEditingId(aluno.id);
    setAlunoSelected(aluno);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await AlunosService.delete(id);
      setAlunos(prev => prev.filter(a => a.id !== id));
      if (alunoSelected?.id === id) {
        setAlunoSelected(null);
      }
      toast.success("Aluno excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir aluno. Tente novamente.");
      console.error("Erro ao excluir aluno:", error);
    }

  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  return (
    <AlunosContext.Provider value={{ alunos, addAluno, updateAluno, editingId, setEditingId, openModal, setOpenModal, alunoSelected, setAlunoSelected, handleEdit, handleDelete }}>
      {children}
    </AlunosContext.Provider>
  );
};
