import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is missing in .env`);
  }

  return value;
};

export const env = {
  nodeEnv: requiredEnv("NODE_ENV"),
  apiPort: Number(requiredEnv("API_PORT")),
  jwtSecret: requiredEnv("JWT_SECRET"),
  storageRoot: requiredEnv("STORAGE_ROOT"),

  postgres: {
    host: requiredEnv("POSTGRES_HOST"),
    port: Number(requiredEnv("POSTGRES_PORT")),
    database: requiredEnv("POSTGRES_DB"),
    user: requiredEnv("POSTGRES_USER"),
    password: requiredEnv("POSTGRES_PASSWORD"),
  },

  redis: {
    host: requiredEnv("REDIS_HOST"),
    port: Number(requiredEnv("REDIS_PORT")),
  },
};