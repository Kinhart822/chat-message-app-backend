export enum SocketEvent {
  // User Events
  USER_STATUS_CHANGE = 'USER_STATUS_CHANGE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  PROFILE_STATUS_CHANGE = 'PROFILE_STATUS_CHANGE',

  // Message Events
  NEW_MESSAGE = 'NEW_MESSAGE',
  EDIT_MESSAGE = 'EDIT_MESSAGE',
  DELETE_MESSAGE = 'DELETE_MESSAGE',
  MARK_MESSAGE_AS_READ = 'MARK_MESSAGE_AS_READ',

  // FRIEND EVENTS
  SEND_FRIEND_REQUEST = 'SEND_FRIEND_REQUEST',
  FRIEND_REQUEST_STATUS_CHANGE = 'FRIEND_REQUEST_STATUS_CHANGE',
  REMOVE_FRIEND = 'REMOVE_FRIEND',
  BLOCK_FRIEND = 'BLOCK_FRIEND',
  UNBLOCK_FRIEND = 'UNBLOCK_FRIEND',

  // Group Events
  CREATE_GROUP = 'CREATE_GROUP',
  EDIT_GROUP = 'EDIT_GROUP',
  ADD_MEMBER_TO_GROUP = 'ADD_MEMBER_TO_GROUP',
  REMOVE_MEMBER_FROM_GROUP = 'REMOVE_MEMBER_FROM_GROUP',
  LEAVE_GROUP = 'LEAVE_GROUP',
}

export const getRoomByCode = (code: string) => `room-${code}`;
export const getUserRoomByEmail = (email: string) => `user-room-${email}`;
export const getConversationRoomById = (conversationId: number) =>
  `conversation-room-${conversationId}`;
