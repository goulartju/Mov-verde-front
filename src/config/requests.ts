import api from './api';

type GetParams = {
  url: string;
  params?: Record<string, unknown>;
};

type MutationParams = {
  url: string;
  body?: unknown;
};

const HttpRequest = {
  get: async <T>({ url, params }: GetParams): Promise<T> => {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  post: async <T>({ url, body }: MutationParams): Promise<T> => {
    const response = await api.post<T>(url, body);
    return response.data;
  },

  put: async <T>({ url, body }: MutationParams): Promise<T> => {
    const response = await api.put<T>(url, body);
    return response.data;
  },

  patch: async <T>({ url, body }: MutationParams): Promise<T> => {
    const response = await api.patch<T>(url, body);
    return response.data;
  },

  delete: async <T>({ url }: GetParams): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};

export default HttpRequest;
