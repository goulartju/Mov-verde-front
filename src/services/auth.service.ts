import config from '@/config/constants';
import HttpRequest from '@/config/requests';

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

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
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

const AuthService = {
  hasToken: (): boolean => {
    return !!window.localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
  },

  login: async (params: LoginParams): Promise<void> => {
    const data = await HttpRequest.post<LoginResponse>({
      url: `${config.API.AUTHORIZATION_URL}/Auth/login`,
      body: params,
    });

    const payload = decodeJwt(data.accessToken);

    window.localStorage.setItem(config.STORAGE.ACCESS_TOKEN, data.accessToken);
    window.localStorage.setItem(config.STORAGE.REFRESH_TOKEN, data.refreshToken);
    if (payload?.email) window.localStorage.setItem(config.STORAGE.USER_EMAIL, payload.email);
    if (payload?.unique_name) window.localStorage.setItem(config.STORAGE.USER_FULLNAME, payload.unique_name);
  },

  logout: () => {
    Object.values(config.STORAGE).forEach((storageKey) =>
      window.localStorage.removeItem(storageKey),
    );
  },

  getLoginUrl: (): string => {
    return '/login';
  },

  getToken: async (params: GetTokenParams): Promise<string> => {
    const token = window.localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
    if (token) return token;

    const data = await HttpRequest.get<GetTokenResponse>({
      url: `${config.API.AUTHORIZATION_URL}/Auth/refresh-token`,
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

  refreshToken: async (): Promise<string> => {
    const refreshToken = window.localStorage.getItem(config.STORAGE.REFRESH_TOKEN);
    if (!refreshToken) throw new Error('Refresh token not found');

    const data = await HttpRequest.post<GetTokenResponse>({
      url: `${config.API.AUTHORIZATION_URL}/login/token/refresh`,
      body: { refresh_token: refreshToken },
    });

    window.localStorage.setItem(config.STORAGE.ACCESS_TOKEN, data.access_token);
    window.localStorage.setItem(config.STORAGE.REFRESH_TOKEN, data.refresh_token);
    window.localStorage.setItem(config.STORAGE.USER_EMAIL, data.email);
    window.localStorage.setItem(config.STORAGE.USER_FULLNAME, data.user);

    return data.access_token;
  },

  verifyPermission: (permissions: string[], permission: string): boolean => {
    return permissions.includes(permission);
  },
};

export { AuthService };

