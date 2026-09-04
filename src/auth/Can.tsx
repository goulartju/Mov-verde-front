import type { ReactNode } from 'react';
import { usePermissao } from '@/hooks/usePermissao';
import { UsuarioPermissao } from '@/types/usuario-types';

type CanProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/** Renderiza os filhos apenas para Editor e Administrador (pode criar/editar/deletar). */
export function CanWrite({ children, fallback = null }: CanProps) {
  const { canWrite } = usePermissao();
  if (!canWrite) return <>{fallback}</>;
  return <>{children}</>;
}

type CanAdminProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/** Renderiza os filhos apenas para Administrador. */
export function CanAdmin({ children, fallback = null }: CanAdminProps) {
  const { permissao } = usePermissao();
  if (permissao !== UsuarioPermissao.Administrador) return <>{fallback}</>;
  return <>{children}</>;
}
