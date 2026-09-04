import axios from 'axios';
import config from '@/config/constants';

const REFRESH_URL = '/Auth/refresh-token';
// Renova antes de expirar para a tela nunca cair no meio do uso.
const LEAD_MS = 60_000;

let timer: ReturnType<typeof setTimeout> | null = null;
let inflight: Promise<string> | null = null;
let listenerReady = false;

type RefreshPayload = {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  expiresIn?: number;
  expires_in?: number;
  email?: string;
  user?: string;
  unique_name?: string;
  nome?: string;
};

const baseURL = (): string => (config.API.AUTHORIZATION_URL ?? '').replace(/\/$/, '');

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

export const getExpiresAt = (): number | null => {
  const raw = window.localStorage.getItem(config.STORAGE.EXPIRES_AT);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const doRefresh = async (): Promise<string> => {
  const refreshToken = window.localStorage.getItem(config.STORAGE.REFRESH_TOKEN);
  if (!refreshToken) throw new Error('Refresh token not found');

  // axios puro (fora do interceptor) para não entrar em loop.
  const { data } = await axios.post<RefreshPayload>(
    `${baseURL()}${REFRESH_URL}`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' } },
  );

  // Backend hoje responde camelCase; mantém tolerância ao snake_case legado.
  const accessToken = data.accessToken ?? data.access_token;
  const nextRefresh = data.refreshToken ?? data.refresh_token;
  if (!accessToken) throw new Error('Refresh response without access token');

  window.localStorage.setItem(config.STORAGE.ACCESS_TOKEN, accessToken);
  if (nextRefresh) window.localStorage.setItem(config.STORAGE.REFRESH_TOKEN, nextRefresh);

  const expiresIn = data.expiresIn ?? data.expires_in;
  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0) {
    window.localStorage.setItem(
      config.STORAGE.EXPIRES_AT,
      String(Date.now() + expiresIn * 1000),
    );
  }

  if (data.email) window.localStorage.setItem(config.STORAGE.USER_EMAIL, data.email);
  const displayName = data.unique_name ?? data.user ?? data.nome;
  if (displayName) window.localStorage.setItem(config.STORAGE.USER_FULLNAME, displayName);

  window.dispatchEvent(new Event('auth:changed'));
  return accessToken;
};

const failSession = (err: unknown): never => {
  Object.values(config.STORAGE).forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new Event('auth:expired'));
  window.dispatchEvent(new Event('auth:changed'));
  throw err;
};

/** Renova os tokens (com deduplicação de chamadas concorrentes). */
export const refreshTokens = (): Promise<string> => {
  if (!inflight) {
    inflight = doRefresh()
      .catch((err: unknown) => failSession(err))
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
};

const schedule = () => {
  clearTimer();
  const expiresAt = getExpiresAt();
  if (!expiresAt) return;
  if (!window.localStorage.getItem(config.STORAGE.REFRESH_TOKEN)) return;

  const wait = expiresAt - Date.now() - LEAD_MS;
  if (wait <= 0) {
    // Já expirou ou está no limite: renova agora em background.
    void refreshTokens().catch(() => {});
    return;
  }
  timer = setTimeout(() => {
    void refreshTokens().catch(() => {});
  }, wait);
};

/** Liga o refresh automático (proativo + reagenda a cada login/refresh). Chamar 1x no boot. */
export const initAutoRefresh = () => {
  if (!listenerReady) {
    listenerReady = true;
    window.addEventListener('auth:changed', schedule);
  }
  schedule();
};
