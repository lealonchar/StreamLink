export class AppConstants {
  private constructor() {
    throw new Error('Utility class should not be instantiated');
  }

  static readonly APP_NAME = 'StreamLink';
  static readonly DEFAULT_TIMEZONE = 'UTC';

  static readonly MIN_USERNAME_LENGTH = 3;
  static readonly MAX_USERNAME_LENGTH = 50;
  static readonly MIN_PASSWORD_LENGTH = 6;
  static readonly MAX_PASSWORD_LENGTH = 100;
  static readonly MAX_NAME_LENGTH = 100;

  static readonly MIN_ROOM_NAME_LENGTH = 1;
  static readonly MAX_ROOM_NAME_LENGTH = 100;
  static readonly MAX_ROOM_DESCRIPTION_LENGTH = 500;

  static readonly MIN_INVITE_MAX_USES = 1;
  static readonly MAX_INVITE_MAX_USES = 1000;
  static readonly MIN_INVITE_EXPIRY_HOURS = 1;
  static readonly MAX_INVITE_EXPIRY_HOURS = 720;
  static readonly DEFAULT_INVITE_MAX_USES = 50;
  static readonly DEFAULT_INVITE_EXPIRY_HOURS = 168;

  static readonly TOKEN_STORAGE_KEY = 'auth_token';
  static readonly USER_STORAGE_KEY = 'auth_user';
}
