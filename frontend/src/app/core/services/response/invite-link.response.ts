import { InviteStatus } from '../../models/invite-status.enum';
import { UserResponse } from './user.response';

export interface InviteLinkResponse {
  id: number;
  roomId: number;
  token: string;
  status: InviteStatus;
  expiresAt: string;
  maxUses: number;
  useCount: number;
  createdBy: UserResponse;
  createdAt: string;
}
