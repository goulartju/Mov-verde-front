import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
  dataNascimento: string;
}

interface AlunosContextType {
  alunos: Aluno[];
  addAluno: (aluno: Omit<Aluno, 'id'>) => void;
  updateAluno: (id: string, aluno: Partial<Aluno>) => void;
  deleteAluno: (id: string) => void;
}

const AlunosContext = createContext<AlunosContextType | undefined>(undefined);

export const useAlunos = () => {
  const context = useContext(AlunosContext);
  if (!context) throw new Error('useAlunos must be used within AlunosProvider');
  return context;
};

export const AlunosProvider = ({ children }: { children: ReactNode }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('alunos');
    if (stored) setAlunos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('alunos', JSON.stringify(alunos));
  }, [alunos]);

  const addAluno = (aluno: Omit<Aluno, 'id'>) => {
    setAlunos(prev => [...prev, { ...aluno, id: Date.now().toString() }]);
  };

  const updateAluno = (id: string, aluno: Partial<Aluno>) => {
    setAlunos(prev => prev.map(a => a.id === id ? { ...a, ...aluno } : a));
  };

  const deleteAluno = (id: string) => {
    setAlunos(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AlunosContext.Provider value={{ alunos, addAluno, updateAluno, deleteAluno }}>
      {children}
    </AlunosContext.Provider>
  );
};
