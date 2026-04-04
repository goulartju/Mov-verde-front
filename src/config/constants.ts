const config = {
  API: {
    AUTHORIZATION_URL: import.meta.env.VITE_AUTH_URL ?? import.meta.env.VITE_API_URL,
  },
  STORAGE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_EMAIL: 'user_email',
    USER_FULLNAME: 'user_fullname',
  },
};

export default config;
