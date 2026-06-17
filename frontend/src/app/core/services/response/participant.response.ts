import { ParticipantRole } from '../../models/participant-role.enum';
import { UserResponse } from './user.response';

export interface ParticipantResponse {
  id: number;
  user: UserResponse;
  role: ParticipantRole;
  joinedAt: string;
}
