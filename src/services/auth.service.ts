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

const AuthService = {
  hasToken: (): boolean => {
    return !!window.localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
  },

  logout: async () => {
    Object.values(config.STORAGE).forEach((storageKey) =>
      window.localStorage.removeItem(storageKey),
    );
    await HttpRequest.post({
      url: `${config.API.AUTHORIZATION_URL}/logout`,
    });
  },

  getLoginUrl: (): string => {
    const redirectUrl = encodeURIComponent(
      `${window.location.origin}${config.CALLBACK}`,
    );
    return `${config.API.AUTHORIZATION_URL}/login?redirect_url=${redirectUrl}`;
  },

  getToken: async (params: GetTokenParams): Promise<string> => {
    const token = window.localStorage.getItem(config.STORAGE.ACCESS_TOKEN);
    if (token) return token;

    const data = await HttpRequest.get<GetTokenResponse>({
      url: `${config.API.AUTHORIZATION_URL}/login/token`,
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
