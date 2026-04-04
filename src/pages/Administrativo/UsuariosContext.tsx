import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Usuario {
  id: string;
  nome: string;
  permissao: string;
  dataNascimento: string;
  cargo: string;
  ativo: boolean;
}

interface UsuariosContextType {
  usuarios: Usuario[];
  addUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, usuario: Partial<Usuario>) => void;
  deleteUsuario: (id: string) => void;
}

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

export const useUsuarios = () => {
  const context = useContext(UsuariosContext);
  if (!context) throw new Error('useUsuarios must be used within UsuariosProvider');
  return context;
};

export const UsuariosProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('usuarios');
    if (stored) setUsuarios(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const addUsuario = (usuario: Omit<Usuario, 'id'>) => {
    setUsuarios(prev => [...prev, { ...usuario, id: Date.now().toString() }]);
  };

  const updateUsuario = (id: string, usuario: Partial<Usuario>) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...usuario } : u));
  };

  const deleteUsuario = (id: string) => {
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  return (
    <UsuariosContext.Provider value={{ usuarios, addUsuario, updateUsuario, deleteUsuario }}>
      {children}
    </UsuariosContext.Provider>
  );
};
