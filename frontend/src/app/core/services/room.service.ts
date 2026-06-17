import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from '../../constants/api.constants';
import { CreateRoomRequest } from './request/create-room.request';
import { RoomResponse } from './response/room.response';
import { RoomDetailResponse } from './response/room-detail.response';
import { MuxTokenResponse } from './response/mux-token.response';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private readonly http = inject(HttpClient);

  getAllActiveRooms(): Observable<RoomResponse[]> {
    return this.http.get<RoomResponse[]>(ApiConstants.ALL_ROOMS_URL);
  }

  getMyRooms(): Observable<RoomResponse[]> {
    return this.http.get<RoomResponse[]>(ApiConstants.MY_ROOMS_URL);
  }

  getRoomById(id: number): Observable<RoomDetailResponse> {
    return this.http.get<RoomDetailResponse>(ApiConstants.ROOM_BY_ID_URL(id));
  }

  createRoom(request: CreateRoomRequest): Observable<RoomResponse> {
    return this.http.post<RoomResponse>(ApiConstants.ALL_ROOMS_URL, request);
  }

  closeRoom(id: number): Observable<void> {
    return this.http.delete<void>(ApiConstants.CLOSE_ROOM_URL(id));
  }

  joinRoom(id: number): Observable<RoomResponse> {
    return this.http.post<RoomResponse>(ApiConstants.JOIN_ROOM_URL(id), {});
  }

  leaveRoom(id: number): Observable<void> {
    return this.http.post<void>(ApiConstants.LEAVE_ROOM_URL(id), {});
  }

  getMuxToken(id: number): Observable<MuxTokenResponse> {
    return this.http.post<MuxTokenResponse>(ApiConstants.MUX_TOKEN_URL(id), {});
  }
}
