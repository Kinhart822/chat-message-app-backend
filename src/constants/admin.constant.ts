export enum EUserManagementAction {
  BLOCK_USER = 'BLOCK_USER',
  UNBLOCK_USER = 'UNBLOCK_USER',
  DELETE_USER = 'DELETE_USER',
}

export enum EIUserManagementAction {
  BLOCK_IUSER = 'BLOCK_USER',
  UNBLOCK_IUSER = 'UNBLOCK_USER',
  DELETE_IUSER = 'DELETE_USER',
}

export enum EIUserAction {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum EAdminManagementAction {
  EDIT_ADMIN_INFO = 'EDIT_ADMIN_INFO',
  DELETE_ADMIN = 'DELETE_ADMIN',
  BLOCK_ADMIN = 'BLOCK_ADMIN',
  UNBLOCK_ADMIN = 'UNBLOCK_ADMIN',
}

export const CODE_EXPIRY_MINUTES = 5;
export const MAX_RESEND_COUNT = 3;
export const RESEND_INTERVAL_SECONDS = 30;
export const MAX_VERIFICATION_ATTEMPTS = 5;
export const RESEND_WINDOW_SECONDS = 60;
