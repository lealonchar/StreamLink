export class RouteConstants {
  private constructor() {
    throw new Error('Utility class should not be instantiated');
  }

  static readonly LOGIN = 'login';
  static readonly REGISTER = 'register';
  static readonly HOME = '';
  static readonly MY_ROOMS = 'my-rooms';
  static readonly ROOM_DETAIL = 'rooms/:id';
  static readonly ROOM_CALL = 'rooms/:id/call';
  static readonly INVITE = 'invites/:token';

  static readonly ROOM_DETAIL_ROUTE = (id: number) => `/rooms/${id}`;
  static readonly ROOM_CALL_ROUTE = (id: number) => `/rooms/${id}/call`;
  static readonly INVITE_ROUTE = (token: string) => `/invites/${token}`;
}
