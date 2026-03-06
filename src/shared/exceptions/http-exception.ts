import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';

// 400
export function httpBadRequest(message?: string, code?: string) {
  throw new BadRequestException({
    statusCode: 400,
    errorCode: code ?? null,
    message,
  });
}

// 401
export function httpUnAuthorized(message?: string, code?: string) {
  throw new UnauthorizedException({
    statusCode: 401,
    errorCode: code ?? null,
    message,
  });
}

// 403
export function httpForbidden(message?: string, code?: string) {
  throw new ForbiddenException({
    statusCode: 403,
    errorCode: code ?? null,
    message,
  });
}

// 404
export function httpNotFound(message?: string, code?: string) {
  throw new NotFoundException({
    statusCode: 404,
    errorCode: code ?? null,
    message,
  });
}

// 500
export function httpInternalServerErrorException(
  message?: string,
  code?: string,
) {
  throw new InternalServerErrorException({
    statusCode: 500,
    errorCode: code ?? null,
    message,
  });
}

// 503
export function httpServiceUnavailable(message?: string, code?: string) {
  throw new ServiceUnavailableException({
    statusCode: 503,
    errorCode: code ?? null,
    message,
  });
}

export const httpErrors = {
  // Bad request
  BAD_REQUEST: {
    message: 'Bad request.',
    code: 'BAD_REQUEST',
  },

  // user error
  ACCOUNT_NOT_FOUND: {
    message: 'Account not found.',
    code: 'ACCOUNT_NOT_FOUND',
  },
  ACCOUNT_EXISTED: {
    message: 'Account already existed.',
    code: 'ACCOUNT_EXISTED',
  },
  ACCOUNT_HASH_NOT_MATCH: {
    message: 'Account adress and hash message are not matched.',
    code: 'ACCOUNT_HASH_NOT_MATCH',
  },
  UNAUTHORIZED: {
    message: 'Unauthorized user.',
    code: 'UNAUTHORIZED',
  },
  BLOCKED_USER: {
    message: 'User has been blocked.',
    code: 'BLOCKED_USER',
  },
  REFRESH_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'REFRESH_TOKEN_EXPIRED',
  },
  ACCESS_TOKEN_EXPIRED: {
    message: 'Refresh tokens is expired.',
    code: 'ACCESS_TOKEN_EXPIRED',
  },
  FORBIDDEN: {
    message: 'You are not authorized to access this resource.',
    code: 'FORBIDDEN',
  },
  EMAIL_EXISTED: {
    message: 'Email has been associted with an other account.',
    code: 'EMAIL_EXISTED',
  },
  ALREADY_LOGOUT: {
    message: 'User has already logout.',
    code: 'ALREADY_LOGOUT',
  },
  INVALID_CREDENTIALS: {
    message: 'Invalid email or password.',
    code: 'INVALID_CREDENTIALS',
  },
};
