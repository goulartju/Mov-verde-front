import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Doacao {
  id: string;
  alunoId: string;
  turmaId: string;
  escolaId: string;
  data: string;
  tampinhas: number;
  lacres: number;
  calendarioId: string;
}

interface DoacoesContextType {
  doacoes: Doacao[];
  addDoacao: (doacao: Omit<Doacao, 'id'>) => void;
  updateDoacao: (id: string, doacao: Partial<Doacao>) => void;
  deleteDoacao: (id: string) => void;
}

const DoacoesContext = createContext<DoacoesContextType | undefined>(undefined);

export const useDoacoes = () => {
  const context = useContext(DoacoesContext);
  if (!context) throw new Error('useDoacoes must be used within DoacoesProvider');
  return context;
};

export const DoacoesProvider = ({ children }: { children: ReactNode }) => {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('doacoes');
    if (stored) setDoacoes(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('doacoes', JSON.stringify(doacoes));
  }, [doacoes]);

  const addDoacao = (doacao: Omit<Doacao, 'id'>) => {
    setDoacoes(prev => [...prev, { ...doacao, id: Date.now().toString() }]);
  };

  const updateDoacao = (id: string, doacao: Partial<Doacao>) => {
    setDoacoes(prev => prev.map(d => d.id === id ? { ...d, ...doacao } : d));
  };

  const deleteDoacao = (id: string) => {
    setDoacoes(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DoacoesContext.Provider value={{ doacoes, addDoacao, updateDoacao, deleteDoacao }}>
      {children}
    </DoacoesContext.Provider>
  );
};
