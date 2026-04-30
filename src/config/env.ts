import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiPort: Number(process.env.API_PORT ?? process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  storageRoot: process.env.STORAGE_ROOT ?? 'storage',
  postgres: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB ?? 'streamforge',
    user: process.env.POSTGRES_USER ?? 'streamforge',
    password: process.env.POSTGRES_PASSWORD ?? 'streamforge'
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379)
  }
};
