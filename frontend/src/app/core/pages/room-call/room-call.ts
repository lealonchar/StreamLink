import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoCallComponent } from '../../components/video-call/video-call';

@Component({
  selector: 'app-room-call-page',
  standalone: true,
  imports: [VideoCallComponent],
  templateUrl: './room-call.html',
  styleUrl: './room-call.scss',
})
export class RoomCallPage {
  readonly roomId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
}
