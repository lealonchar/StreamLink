import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomResponse } from '../../services/response/room.response';
import { RouteConstants } from '../../../constants/route.constants';
import { RoomStatus } from '../../models/room-status.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './room-card.html',
  styleUrl: './room-card.scss',
})
export class RoomCardComponent {
  readonly room = input.required<RoomResponse>();
  protected readonly RouteConstants = RouteConstants;
  protected readonly RoomStatus = RoomStatus;
}
