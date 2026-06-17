import { RoomStatus } from '../../models/room-status.enum';
import { UserResponse } from './user.response';

export interface RoomResponse {
  id: number;
  name: string;
  description?: string;
  status: RoomStatus;
  createdBy: UserResponse;
  createdAt: string;
}
