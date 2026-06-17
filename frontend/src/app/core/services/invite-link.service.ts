import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from '../../constants/api.constants';
import { CreateInviteRequest } from './request/create-invite.request';
import { InviteLinkResponse } from './response/invite-link.response';
import { RoomResponse } from './response/room.response';

@Injectable({
  providedIn: 'root',
})
export class InviteLinkService {
  private readonly http = inject(HttpClient);

  createInvite(roomId: number, request: CreateInviteRequest): Observable<InviteLinkResponse> {
    return this.http.post<InviteLinkResponse>(ApiConstants.ROOM_INVITES_URL(roomId), request);
  }

  getRoomInvites(roomId: number): Observable<InviteLinkResponse[]> {
    return this.http.get<InviteLinkResponse[]>(ApiConstants.ROOM_INVITES_URL(roomId));
  }

  getInviteByToken(token: string): Observable<InviteLinkResponse> {
    return this.http.get<InviteLinkResponse>(ApiConstants.INVITE_BY_TOKEN_URL(token));
  }

  joinByInvite(token: string): Observable<RoomResponse> {
    return this.http.post<RoomResponse>(ApiConstants.JOIN_BY_INVITE_URL(token), {});
  }

  revokeInvite(inviteId: number): Observable<void> {
    return this.http.delete<void>(ApiConstants.REVOKE_INVITE_URL(inviteId));
  }
}
