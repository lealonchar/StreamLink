import { RoomStatus } from '../../models/room-status.enum';
import { ParticipantResponse } from './participant.response';
import { UserResponse } from './user.response';

export interface RoomDetailResponse {
  id: number;
  name: string;
  description?: string;
  status: RoomStatus;
  createdBy: UserResponse;
  participants: ParticipantResponse[];
  createdAt: string;
}
