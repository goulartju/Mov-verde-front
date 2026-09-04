const config = {
  API: {
    AUTHORIZATION_URL: import.meta.env.VITE_AUTH_URL ?? import.meta.env.VITE_API_URL,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
  },
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    EXPIRES_AT: 'expires_at',
    USER_EMAIL: 'user_email',
    USER_FULLNAME: 'user_fullname',
    USER_PERMISSAO: 'user_permissao',
    USER_DATA: 'user_data',
  },
};

export default config;
