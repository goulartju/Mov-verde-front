import axios from 'axios';

const pickFirstString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = pickFirstString(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return (
      pickFirstString(record.message) ??
      pickFirstString(record.detail) ??
      pickFirstString(record.error) ??
      pickFirstString(record.title) ??
      pickFirstString(record.errors) ??
      null
    );
  }
  return null;
};

/** Extrai a mensagem de erro do backend (string, {message}, ProblemDetails, {errors}...) com fallback. */
export const getApiErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    return (
      pickFirstString(err.response?.data) ??
      (!err.response && err.message ? err.message : null) ??
      fallback
    );
  }
  if (err instanceof Error && err.message) return err.message;
  return pickFirstString(err) ?? fallback;
};
