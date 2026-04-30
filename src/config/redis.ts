import { env } from './env';

export const redisConfig = env.redis;

export async function connectRedis() {
  return {
    status: 'configured',
    host: redisConfig.host,
    port: redisConfig.port
  };
}
