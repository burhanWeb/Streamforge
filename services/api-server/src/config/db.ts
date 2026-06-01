import { env } from './env.ts';
import { Pool } from 'pg'

export const dbConfig = new Pool({
  host: env.postgres.host,
  port: env.postgres.port,
  database: env.postgres.database,
  user: env.postgres.user,
  password: env.postgres.password,
})

export async function connectDatabase() {
  try {
    const client = await dbConfig.connect();
    console.log('db connected');
    client.release();

  } catch (error) {
    console.log(" Database connection failed", error);

    process.exit(1);
  }
}
