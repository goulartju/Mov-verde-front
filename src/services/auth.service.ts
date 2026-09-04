import config from '@/config/constants';
import HttpRequest from '@/config/requests';
import { refreshTokens } from '@/services/token-refresh';

type GetTokenParams = {
  code?: string;
};

type GetTokenResponse = {
  user: string;
  email: string;
  access_token: string;
  refresh_token: string;
};

type LoginParams = {
  email: string;
  senha: string;
};

type GoogleLoginParams = {
  idToken: string;
  clientId: string;
};

type UsuarioLogin = {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  permissao: number;
  ativo: boolean;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  usuario?: UsuarioLogin | null;
};

type JwtPayload = {
  nameid?: string;
  email?: string;
  unique_name?: string;
  role?: string;
};

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    return JSON.parse(atob(token.split('.')[1])) as JwtPayload;
  } catch {
    return null;
  }
};

const roleToPermissao = (role?: string | null): number | null => {
  if (role == null || role === '') return null;
  // Aceita "0"/"1"/"2", "Visualizador"/"Editor"/"Administrador" e claims antigos "1"/"2"/"3"
  const normalized = role.trim().toLowerCase();
  if (normalized === '0' || normalized === 'visualizador') return 0;
  if (normalized === '1' || normalized === 'editor') return 1;
  if (normalized === '2' || normalized === 'administrador') return 2;
  // Compat: enum antigo 1/2/3 -> converte para 0/1/2
  if (normalized === '3') return 2;
  const asNumber = Number(role);
  if (Number.isFinite(asNumber)) {
    if (asNumber >= 0 && asNumber <= 2) return asNumber;
    if (asNumber === 3) return 2;
  }
  return null;
};

const persistSession = (data: LoginResponse) => {
  const payload = data.accessToken ? decodeJwt(data.accessToken) : null;

  // Prioridade: objeto usuario retornado pela API
  let permissao: number | null =
    typeof data.usuario?.permissao === 'number' ? data.usuario.permissao : null;

  // Fallback: claim role do JWT
  if (permissao == null) permissao = roleToPermissao(payload?.role);

  window.localStorage.setItem(config.STORAGE.ACCESS_TOKEN, data.accessToken);
  window.localStorage.setItem(config.STORAGE.REFRESH_TOKEN, data.refreshToken);
  if (typeof data.expiresIn === 'number' && Number.isFinite(data.expiresIn) && data.expiresIn > 0) {
    window.localStorage.setItem(
      config.STORAGE.EXPIRES_AT,
      String(Date.now() + data.expiresIn * 1000),
    );
  }
  if (payload?.email || data.usuario?.email)
    window.localStorage.setItem(
      config.STORAGE.USER_EMAIL,
      data.usuario?.email ?? payload?.email ?? '',
    );
  if (payload?.unique_name || data.usuario?.nome)
    window.localStorage.setItem(
      config.STORAGE.USER_FULLNAME,
      data.usuario?.nome ?? payload?.unique_name ?? '',
    );
  if (permissao != null)
    window.localStorage.setItem(config.STORAGE.USER_PERMISSAO, String(permissao));
  if (data.usuario)
    window.localStorage.setItem(config.STORAGE.USER_DATA, JSON.stringify(data.usuario));

  window.dispatchEvent(new Event('auth:changed'));
};

const readPermissao = (): number | null => {
  const raw = window.localStorage.getItem(config.STORAGE.USER_PERMISSAO);
  if (raw != null && raw !== '') {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) return parsed;
  }
  // Fallback para sessão antiga (só token salvo): tenta extrair do JWT
  const token = window.localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
  if (token) {
    const fromRole = roleToPermissao(decodeJwt(token)?.role);
    if (fromRole != null) return fromRole;
  }
  return null;
};

const AuthService = {
  hasToken: (): boolean => {
    return !!window.localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
  },

  login: async (params: LoginParams): Promise<void> => {
    const data = await HttpRequest.post<LoginResponse>({
      url: '/Auth/login',
      body: params,
    });

    persistSession(data);
  },

  loginWithGoogle: async (params: GoogleLoginParams): Promise<void> => {
    const data = await HttpRequest.post<LoginResponse>({
      url: '/Auth/google-login',
      body: params,
    });

    persistSession(data);
  },

  logout: () => {
    Object.values(config.STORAGE).forEach((storageKey) =>
      window.localStorage.removeItem(storageKey),
    );
    window.dispatchEvent(new Event('auth:changed'));
  },

  getLoginUrl: (): string => {
    return '/login';
  },

  getToken: async (params: GetTokenParams): Promise<string> => {
    const token = window.localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
    if (token) return token;

    const data = await HttpRequest.get<GetTokenResponse>({
      url: '/Auth/refresh-token',
      params,
    });

    window.localStorage.setItem(config.STORAGE.ACCESS_TOKEN, data.access_token);
    window.localStorage.setItem(config.STORAGE.REFRESH_TOKEN, data.refresh_token);
    window.localStorage.setItem(config.STORAGE.USER_EMAIL, data.email);
    window.localStorage.setItem(config.STORAGE.USER_FULLNAME, data.user);

    return data.access_token;
  },

  getUserFullname: (): string | undefined => {
    return window.localStorage.getItem(config.STORAGE.USER_FULLNAME) ?? undefined;
  },

  getUserEmail: (): string | undefined => {
    return window.localStorage.getItem(config.STORAGE.USER_EMAIL) ?? undefined;
  },

  refreshToken: (): Promise<string> => refreshTokens(),

  getPermissao: (): number | null => readPermissao(),

  getUsuario: (): UsuarioLogin | null => {
    try {
      const raw = window.localStorage.getItem(config.STORAGE.USER_DATA);
      return raw ? (JSON.parse(raw) as UsuarioLogin) : null;
    } catch {
      return null;
    }
  },

  isAdministrador: (): boolean => readPermissao() === 2,

  /** Editor (1) e Administrador (2) podem criar/editar/deletar. Visualizador (0) é só leitura. */
  canWrite: (): boolean => {
    const p = readPermissao();
    return p === 1 || p === 2;
  },

  verifyPermission: (permissions: string[], permission: string): boolean => {
    return permissions.includes(permission);
  },
};

export { AuthService };

