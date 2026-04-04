import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Escola {
  id: string;
  nome: string;
  endereco: string;
  contato: string;
}

interface EscolasContextType {
  escolas: Escola[];
  addEscola: (escola: Omit<Escola, 'id'>) => void;
  updateEscola: (id: string, escola: Partial<Escola>) => void;
  deleteEscola: (id: string) => void;
}

const EscolasContext = createContext<EscolasContextType | undefined>(undefined);

export const useEscolas = () => {
  const context = useContext(EscolasContext);
  if (!context) throw new Error('useEscolas must be used within EscolasProvider');
  return context;
};

export const EscolasProvider = ({ children }: { children: ReactNode }) => {
  const [escolas, setEscolas] = useState<Escola[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('escolas');
    if (stored) setEscolas(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('escolas', JSON.stringify(escolas));
  }, [escolas]);

  const addEscola = (escola: Omit<Escola, 'id'>) => {
    setEscolas(prev => [...prev, { ...escola, id: Date.now().toString() }]);
  };

  const updateEscola = (id: string, escola: Partial<Escola>) => {
    setEscolas(prev => prev.map(e => e.id === id ? { ...e, ...escola } : e));
  };

  const deleteEscola = (id: string) => {
    setEscolas(prev => prev.filter(e => e.id !== id));
  };

  return (
    <EscolasContext.Provider value={{ escolas, addEscola, updateEscola, deleteEscola }}>
      {children}
    </EscolasContext.Provider>
  );
};
