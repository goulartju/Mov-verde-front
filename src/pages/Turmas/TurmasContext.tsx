import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Turma {
  id: string;
  nome: string;
  ano: string;
  escolaId: string;
  turno: string;
  calendario: string;
  representante: string;
}

interface TurmasContextType {
  turmas: Turma[];
  addTurma: (turma: Omit<Turma, 'id'>) => void;
  updateTurma: (id: string, turma: Partial<Turma>) => void;
  deleteTurma: (id: string) => void;
}

const TurmasContext = createContext<TurmasContextType | undefined>(undefined);

export const useTurmas = () => {
  const context = useContext(TurmasContext);
  if (!context) throw new Error('useTurmas must be used within TurmasProvider');
  return context;
};

export const TurmasProvider = ({ children }: { children: ReactNode }) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('turmas');
    if (stored) setTurmas(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('turmas', JSON.stringify(turmas));
  }, [turmas]);

  const addTurma = (turma: Omit<Turma, 'id'>) => {
    setTurmas(prev => [...prev, { ...turma, id: Date.now().toString() }]);
  };

  const updateTurma = (id: string, turma: Partial<Turma>) => {
    setTurmas(prev => prev.map(t => t.id === id ? { ...t, ...turma } : t));
  };

  const deleteTurma = (id: string) => {
    setTurmas(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TurmasContext.Provider value={{ turmas, addTurma, updateTurma, deleteTurma }}>
      {children}
    </TurmasContext.Provider>
  );
};
