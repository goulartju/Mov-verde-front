import { UsuariosService } from '@/services/usuarios.service';
import type { Usuario } from '@/types/usuario-types';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from "sonner";

interface UsuariosContextType {
  usuarios: Usuario[];
  usuarioSelected: Usuario | null;
  editingId: string | null;
  openModal: boolean;
  setEditingId: (id: string | null) => void;
  setOpenModal: (open: boolean) => void;
  setUsuarioSelected: (usuario: Usuario | null) => void;
  addUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  updateUsuario: (id: string, usuario: Partial<Usuario>) => void;
  handleDelete: (id: string) => void;
  handleEdit: (usuario: Usuario) => void;
}

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined);

export const useUsuarios = () => {
  const context = useContext(UsuariosContext);
  if (!context) throw new Error('useUsuarios must be used within UsuariosProvider');
  return context;
};

export const UsuariosProvider = ({ children }: { children: ReactNode }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [usuarioSelected, setUsuarioSelected] = useState<Usuario | null>(null);

  const fetchUsuarios = async () => {
    try {
      const data = await UsuariosService.getAll();
      setUsuarios(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários. Tente novamente.");
    }
  };

  const addUsuario = async (usuario: Omit<Usuario, 'id'>) => {
    try {
      const newUsuario = await UsuariosService.create(usuario);
      setUsuarios(prev => [...prev, newUsuario]);
    } catch (error) {
      toast.error("Erro ao criar usuário. Tente novamente.");
    }
  };

  const updateUsuario = async (id: string, usuario: Partial<Usuario>) => {
    try {
      const updatedUsuario = await UsuariosService.update(id, usuario);
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...updatedUsuario } : u));
      setUsuarioSelected(usuarios.find(u => u.id === id) || null);
    } catch (error) {
      toast.error("Erro ao atualizar usuário. Tente novamente.");
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setUsuarioSelected(usuario);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await UsuariosService.delete(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
      if (editingId === id) {
        setUsuarioSelected(null);
      }
      toast.success("Usuário excluído com sucesso!");
    }
    catch (error) {
      toast.error("Erro ao excluir usuário.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <UsuariosContext.Provider value={{ usuarios, addUsuario, updateUsuario, handleDelete, handleEdit, openModal, setOpenModal, editingId, setEditingId, usuarioSelected, setUsuarioSelected }}>
      {children}
    </UsuariosContext.Provider>
  );
};
