/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { DoacoesService } from '@/services/doacoes.service';
import type { Doacao, DoacoesFilter, DoacoesUpdatePayload } from '@/types/doacoes-types';

interface DoacoesContextType {
  doacoes: Doacao[];
  filtroDoacoes: DoacoesFilter;
  setFiltroDoacoes: (filter: DoacoesFilter) => void;
  buscarDoacoes: (filter: DoacoesFilter) => Promise<Doacao[]>;
  updateDoacoes: (payload: DoacoesUpdatePayload) => Promise<Doacao[]>;
  deleteDoacao: (id: string) => void;
}

const DoacoesContext = createContext<DoacoesContextType | undefined>(undefined);

const normalizeDoacao = (doacao: Doacao): Doacao => ({
  ...doacao,
  alunoId: doacao.alunoId ?? doacao.matriculaId,
  turmaId: doacao.turmaId ?? "",
  lacres: doacao.lacres ?? doacao.qtdLacre,
  tampinhas: doacao.tampinhas ?? doacao.qtdTampinha,
});

export const useDoacoes = () => {
  const context = useContext(DoacoesContext);
  if (!context) throw new Error('useDoacoes must be used within DoacoesProvider');
  return context;
};

export const DoacoesProvider = ({ children }: { children: ReactNode }) => {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [filtroDoacoes, setFiltroDoacoesState] = useState<DoacoesFilter>({});

  const buscarDoacoes = async (filter: DoacoesFilter) => {
    setFiltroDoacoesState(filter);

    try {
      const doacoesFiltradas = await DoacoesService.getByFilter(filter);
      const doacoes = doacoesFiltradas.length > 0
        ? doacoesFiltradas
        : await DoacoesService.createByFilter(filter);

      const normalizedDoacoes = doacoes.map(normalizeDoacao);
      setDoacoes(normalizedDoacoes);
      return normalizedDoacoes;
    } catch {
      toast.error("Erro ao carregar doacoes. Tente novamente.");
      throw new Error("Erro ao carregar doacoes.");
    }
  };

  const setFiltroDoacoes = (filter: DoacoesFilter) => {
    setFiltroDoacoesState(filter);
  };

  const updateDoacoes = async (payload: DoacoesUpdatePayload) => {
    try {
      const updatedDoacoes = await DoacoesService.update(payload);
      const normalizedDoacoes = updatedDoacoes.map(normalizeDoacao);
      setDoacoes(prev => {
        const updatedIds = new Set(normalizedDoacoes.map(d => d.id).filter(Boolean));
        return [
          ...prev.filter(d => !d.id || !updatedIds.has(d.id)),
          ...normalizedDoacoes,
        ];
      });
      return normalizedDoacoes;
    } catch (error) {
      toast.error("Erro ao atualizar doacoes. Tente novamente.");
      throw error;
    }
  };

  const deleteDoacao = async (id: string) => {
    try {
      await DoacoesService.delete(id);
      setDoacoes(prev => prev.filter(d => d.id !== id));
      toast.success("Doacao excluida com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir doacao. Tente novamente.");
      console.error("Erro ao excluir doacao:", error);
    }
  };

  return (
    <DoacoesContext.Provider value={{ doacoes, filtroDoacoes, setFiltroDoacoes, buscarDoacoes, updateDoacoes, deleteDoacao }}>
      {children}
    </DoacoesContext.Provider>
  );
};
