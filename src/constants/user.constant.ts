import { IMailType } from './mail.constant';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum RoleUser {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum AccessMethod {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
  AUDIO = 'AUDIO',
}

export enum ConversationType {
  DIRECT = 'DIRECT',
  GROUP = 'GROUP',
}

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum ParticipantRole {
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

export enum ParticipantStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  LEFT = 'LEFT',
  REMOVED = 'REMOVED',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum MessageType {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
  SYSTEM = 'SYSTEM',
}

export enum MessageStatus {
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

export enum MessageAttachmentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
}

export const FORGOT_RES = 'OTP for password reset has been sent to your email.';
export const RESEND_RES = (type: IMailType) => {
  return `Verification code (${type}) has been resent.`;
};
export const RESET_PASSWORD_RES = 'Password has been reset successfully.';
export const LOGOUT_RES = 'User has been logged out successfully.';
export const VERIFY_ACCOUNT_RES = (type: IMailType) => {
  if (type === IMailType.SIGN_UP) {
    return 'Account verified and activated.';
  } else if (type === IMailType.FORGOT_PASSWORD) {
    return 'Verification successful. You can now reset your password.';
  }
};
