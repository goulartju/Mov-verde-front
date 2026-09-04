import { useCallback, useEffect, useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { UsuarioPermissao } from '@/types/usuario-types';

export function usePermissao() {
  const [permissao, setPermissao] = useState<number | null>(() =>
    AuthService.getPermissao(),
  );

  useEffect(() => {
    const sync = () => setPermissao(AuthService.getPermissao());
    sync();
    window.addEventListener('auth:changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('auth:changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isAdmin = permissao === UsuarioPermissao.Administrador;
  const isEditor =
    permissao === UsuarioPermissao.Editor || isAdmin;
  const isVisualizador =
    permissao === UsuarioPermissao.Visualizador || permissao == null;

  // Regra do produto: só Editor e Administrador podem criar/editar/deletar.
  const canWrite =
    permissao === UsuarioPermissao.Editor ||
    permissao === UsuarioPermissao.Administrador;

  const requireWrite = useCallback(() => canWrite, [canWrite]);

  return {
    permissao,
    isAdmin,
    isEditor,
    isVisualizador,
    canWrite,
    requireWrite,
  };
}
