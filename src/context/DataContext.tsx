import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Calendario {
  id: string;
  ano: number;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

export interface Escola {
  id: string;
  nome: string;
  endereco: string;
  contato: string;
}

export interface Turma {
  id: string;
  nome: string;
  ano: string;
  escolaId: string;
  turno: string;
  calendario: string;
  representante: string;
}

export interface Aluno {
  id: string;
  nome: string;
  turmaId: string;
  dataNascimento: string;
}

export interface Usuario {
  id: string;
  nome: string;
  permissao: string;
  dataNascimento: string;
  cargo: string;
  ativo: boolean;
}

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

interface DataContextType {
  calendarios: Calendario[];
  escolas: Escola[];
  turmas: Turma[];
  alunos: Aluno[];
  usuarios: Usuario[]
  doacoes: Doacao[];

  addCalendario: (calendario: Omit<Calendario, 'id'>) => void;
  updateCalendario: (id: string, calendario: Partial<Calendario>) => void;
  deleteCalendario: (id: string) => void;

  addEscola: (escola: Omit<Escola, 'id'>) => void;
  updateEscola: (id: string, escola: Partial<Escola>) => void;
  deleteEscola: (id: string) => void;

  addTurma: (turma: Omit<Turma, 'id'>) => void;
  updateTurma: (id: string, turma: Partial<Turma>) => void;
  deleteTurma: (id: string) => void;

  addAluno: (aluno: Omit<Aluno, 'id'>) => void;
  updateAluno: (id: string, aluno: Partial<Aluno>) => void;
  deleteAluno: (id: string) => void;

  addUsuario: (aluno: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, aluno: Partial<Aluno>) => void;
  deleteUsuario: (id: string) => void;

  addDoacao: (doacao: Omit<Doacao, 'id'>) => void;
  updateDoacao: (id: string, doacao: Partial<Doacao>) => void;
  deleteDoacao: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [calendarios, setCalendarios] = useState<Calendario[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);


  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedCalendarios = localStorage.getItem('calendarios');
        const storedEscolas = localStorage.getItem('escolas');
        const storedTurmas = localStorage.getItem('turmas');
        const storedAlunos = localStorage.getItem('alunos');
        const storedUsuarios = localStorage.getItem('usuarios');
        const storedDoacoes = localStorage.getItem('doacoes');

        if (storedCalendarios) setCalendarios(JSON.parse(storedCalendarios));
        if (storedEscolas) setEscolas(JSON.parse(storedEscolas));
        if (storedTurmas) setTurmas(JSON.parse(storedTurmas));
        if (storedAlunos) setAlunos(JSON.parse(storedAlunos));
        if (storedUsuarios) setUsuarios(JSON.parse(storedUsuarios));
        if (storedDoacoes) setDoacoes(JSON.parse(storedDoacoes));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calendarios', JSON.stringify(calendarios));
  }, [calendarios]);

  useEffect(() => {
    localStorage.setItem('escolas', JSON.stringify(escolas));
  }, [escolas]);

  useEffect(() => {
    localStorage.setItem('turmas', JSON.stringify(turmas));
  }, [turmas]);

  useEffect(() => {
    localStorage.setItem('alunos', JSON.stringify(alunos));
  }, [alunos]);

  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('doacoes', JSON.stringify(doacoes));
  }, [doacoes]);

  // Calendario operations
  const addCalendario = (calendario: Omit<Calendario, 'id'>) => {
    const newCalendario = { ...calendario, id: Date.now().toString() };
    setCalendarios([...calendarios, newCalendario]);
  };

  const updateCalendario = (id: string, calendario: Partial<Calendario>) => {
    setCalendarios(calendarios.map(c => c.id === id ? { ...c, ...calendario } : c));
  };

  const deleteCalendario = (id: string) => {
    setCalendarios(calendarios.filter(c => c.id !== id));
  };

  // Escola operations
  const addEscola = (escola: Omit<Escola, 'id'>) => {
    const newEscola = { ...escola, id: Date.now().toString() };
    setEscolas([...escolas, newEscola]);
  };

  const updateEscola = (id: string, escola: Partial<Escola>) => {
    setEscolas(escolas.map(e => e.id === id ? { ...e, ...escola } : e));
  };

  const deleteEscola = (id: string) => {
    setEscolas(escolas.filter(e => e.id !== id));
  };

  // Turma operations
  const addTurma = (turma: Omit<Turma, 'id'>) => {
    const newTurma = { ...turma, id: Date.now().toString() };
    setTurmas([...turmas, newTurma]);
  };

  const updateTurma = (id: string, turma: Partial<Turma>) => {
    setTurmas(turmas.map(t => t.id === id ? { ...t, ...turma } : t));
  };

  const deleteTurma = (id: string) => {
    setTurmas(turmas.filter(t => t.id !== id));
  };

  // Aluno operations
  const addAluno = (aluno: Omit<Aluno, 'id'>) => {
    const newAluno = { ...aluno, id: Date.now().toString() };
    setAlunos([...alunos, newAluno]);
  };

  const updateAluno = (id: string, aluno: Partial<Aluno>) => {
    setAlunos(alunos.map(a => a.id === id ? { ...a, ...aluno } : a));
  };

  const deleteAluno = (id: string) => {
    setAlunos(alunos.filter(a => a.id !== id));
  };

  //Usuario operations
  const addUsuario = (usuario: Omit<Usuario, 'id'>) => {
    const newUsuario = { ...usuario, id: Date.now().toString() };
    setUsuarios([...usuarios, newUsuario]);
  };

  const updateUsuario = (id: string, usuario: Partial<Usuario>) => {
    setUsuarios(usuarios.map(a => a.id === id ? { ...a, ...usuario } : a));
  };

  const deleteUsuario = (id: string) => {
    setUsuarios(usuarios.filter(a => a.id !== id));
  };

  // Doacao operations
  const addDoacao = (doacao: Omit<Doacao, 'id'>) => {
    const newDoacao = { ...doacao, id: Date.now().toString() };
    setDoacoes([...doacoes, newDoacao]);
  };

  const updateDoacao = (id: string, doacao: Partial<Doacao>) => {
    setDoacoes(doacoes.map(d => d.id === id ? { ...d, ...doacao } : d));
  };

  const deleteDoacao = (id: string) => {
    setDoacoes(doacoes.filter(d => d.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        calendarios,
        escolas,
        turmas,
        alunos,
        usuarios,
        doacoes,
        addCalendario,
        updateCalendario,
        deleteCalendario,
        addEscola,
        updateEscola,
        deleteEscola,
        addTurma,
        updateTurma,
        deleteTurma,
        addAluno,
        updateAluno,
        deleteAluno,
        addUsuario,
        updateUsuario,
        deleteUsuario,
        addDoacao,
        updateDoacao,
        deleteDoacao,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
