import { parseDuration } from 'utils/util';
import { IMailType } from './mail.constant';

export const MAIL_ACTION_TTL = parseDuration('5m');

// Redis key prefixes
export const getRedisMailTypeOtp = (mail: string, type: IMailType) =>
  `mail:action:${type}:${mail}`;
