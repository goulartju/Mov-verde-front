import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Calendario } from '@/types/calendario-types';

interface CalendariosContextType {
  calendarios: Calendario[];
  addCalendario: (calendario: Omit<Calendario, 'id'>) => void;
  updateCalendario: (id: string, calendario: Partial<Calendario>) => void;
  deleteCalendario: (id: string) => void;
}

const CalendariosContext = createContext<CalendariosContextType | undefined>(undefined);

export const useCalendarios = () => {
  const context = useContext(CalendariosContext);
  if (!context) throw new Error('useCalendarios must be used within CalendariosProvider');
  return context;
};

export const CalendariosProvider = ({ children }: { children: ReactNode }) => {
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('calendarios');
    if (stored) setCalendarios(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarios', JSON.stringify(calendarios));
  }, [calendarios]);

  const addCalendario = (calendario: Omit<Calendario, 'id'>) => {
    setCalendarios(prev => [...prev, { ...calendario, id: Date.now().toString() }]);
  };

  const updateCalendario = (id: string, calendario: Partial<Calendario>) => {
    setCalendarios(prev => prev.map(c => c.id === id ? { ...c, ...calendario } : c));
  };

  const deleteCalendario = (id: string) => {
    setCalendarios(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CalendariosContext.Provider value={{ calendarios, addCalendario, updateCalendario, deleteCalendario }}>
      {children}
    </CalendariosContext.Provider>
  );
};
