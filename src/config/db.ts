import { env } from './env';

export const dbConfig = env.postgres;

export async function connectDatabase() {
  return {
    status: 'configured',
    host: dbConfig.host,
    database: dbConfig.database
  };
}
