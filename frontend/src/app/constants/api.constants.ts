export class ApiConstants {
  private constructor() {
    throw new Error('Utility class should not be instantiated');
  }

  static readonly API_BASE_URL = 'http://localhost:8080';
  static readonly API_BASE_PATH = '/api';

  static readonly AUTH_PATH = `${ApiConstants.API_BASE_PATH}/auth`;
  static readonly ROOMS_PATH = `${ApiConstants.API_BASE_PATH}/rooms`;
  static readonly INVITES_PATH = `${ApiConstants.API_BASE_PATH}/invites`;
  static readonly USERS_PATH = `${ApiConstants.API_BASE_PATH}/users`;

  static readonly REGISTER_URL = `${ApiConstants.AUTH_PATH}/register`;
  static readonly LOGIN_URL = `${ApiConstants.AUTH_PATH}/login`;

  static readonly CURRENT_USER_URL = `${ApiConstants.USERS_PATH}/me`;

  static readonly ALL_ROOMS_URL = ApiConstants.ROOMS_PATH;
  static readonly MY_ROOMS_URL = `${ApiConstants.ROOMS_PATH}/my`;
  static readonly ROOM_BY_ID_URL = (id: number) => `${ApiConstants.ROOMS_PATH}/${id}`;
  static readonly CLOSE_ROOM_URL = (id: number) => `${ApiConstants.ROOMS_PATH}/${id}`;
  static readonly JOIN_ROOM_URL = (id: number) => `${ApiConstants.ROOMS_PATH}/${id}/join`;
  static readonly LEAVE_ROOM_URL = (id: number) => `${ApiConstants.ROOMS_PATH}/${id}/leave`;
  static readonly MUX_TOKEN_URL = (id: number) => `${ApiConstants.ROOMS_PATH}/${id}/token`;

  static readonly ROOM_INVITES_URL = (roomId: number) => `${ApiConstants.ROOMS_PATH}/${roomId}/invites`;
  static readonly INVITE_BY_TOKEN_URL = (token: string) => `${ApiConstants.INVITES_PATH}/${token}`;
  static readonly JOIN_BY_INVITE_URL = (token: string) => `${ApiConstants.INVITES_PATH}/${token}/join`;
  static readonly REVOKE_INVITE_URL = (inviteId: number) => `${ApiConstants.INVITES_PATH}/${inviteId}`;
}
