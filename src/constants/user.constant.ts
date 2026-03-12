import { IMailType } from './mail.constant';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum RoleUser {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum AccessMethod {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
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
