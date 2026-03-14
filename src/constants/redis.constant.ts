import { RedisClientType, createClient } from 'redis';
import { parseDuration } from 'utils/util';
import { IMailType } from './mail.constant';

export function createClientRedis(): RedisClientType {
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;
  const password = process.env.REDIS_PASSWORD;
  const database = +process.env.REDIS_DB || 0;

  return createClient({
    url: `redis://${host}:${port}`,
    password,
    database,
    pingInterval: 5000,
  });
}

export const MAIL_ACTION_TTL = parseDuration('5m');

// Redis key prefixes
export const getRedisMailTypeOtp = (mail: string, type: IMailType) =>
  `mail:action:${type}:${mail}`;
