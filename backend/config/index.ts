import { env } from './env'

export const config = {
  env: env.NODE_ENV,

  server: {
    port: env.PORT,
  },

  db: {
    url:
      env.NODE_ENV === "test"
        ? env.MONGO_URI_TEST
        : env.MONGO_URI_DEV,
  },

  cors: {
    origin: env.FRONTEND_URL,
  },

  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
  },

  test: {
    token: env.TOKEN_TESTING,
  },
};