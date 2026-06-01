import { env } from "./env.ts";

export const redisConfig = env.redis;

export async function connectRedis() {
  return {
    status: 'configured',
    host: redisConfig.host,
    port: redisConfig.port
  };
}
