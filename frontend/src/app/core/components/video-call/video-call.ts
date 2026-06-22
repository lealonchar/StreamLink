import { Component, ElementRef, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Room, RoomEvent, Track, type RemoteParticipant, type RemoteTrack } from 'livekit-client';
import { lastValueFrom } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { RouteConstants } from '../../../constants/route.constants';

interface VideoTile {
  id: string;
  isLocal: boolean;
  displayName: string;
  hasVideo: boolean;
}

@Component({
  selector: 'app-video-call',
  standalone: true,
  templateUrl: './video-call.html',
  styleUrl: './video-call.scss',
})
export class VideoCallComponent implements OnInit, OnDestroy {
  private readonly roomService = inject(RoomService);
  private readonly router = inject(Router);
  private readonly elRef = inject(ElementRef);
  private leaveRequested = false;

  readonly roomId = input.required<number>();

  room = signal<Room | null>(null);
  tiles = signal<VideoTile[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isMicMuted = signal(false);
  isCamOff = signal(false);

  async ngOnInit(): Promise<void> {
    try {
      const liveKitToken = await lastValueFrom(this.roomService.getLiveKitToken(this.roomId()));
      if (!liveKitToken) {
        throw new Error('Failed to get LiveKit token');
      }

      const roomInstance = new Room();
      this.room.set(roomInstance);

      roomInstance.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        this.addTile(participant);
      });

      roomInstance.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        this.removeTile(participant.identity);
      });

      roomInstance.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        if (participant.isLocal) return;
        this.addTile(participant);
        if (track.kind === Track.Kind.Video) {
          this.handleTrackSubscribed(participant.identity, track as RemoteTrack);
        }
      });

      roomInstance.on(RoomEvent.TrackUnsubscribed, (track, _publication, participant) => {
        if (participant.isLocal) return;
        if (track.kind === Track.Kind.Video) {
          this.handleTrackUnsubscribed(participant.identity);
        }
      });

      roomInstance.on(RoomEvent.LocalTrackPublished, (publication) => {
        if (publication.track?.kind === Track.Kind.Video) {
          setTimeout(() => {
            const localVideo = this.elRef.nativeElement.querySelector('video[data-participant-id="local"]') as HTMLVideoElement | null;
            if (localVideo) {
              publication.track?.attach(localVideo);
            }
          }, 0);
        }
      });

      await roomInstance.connect(liveKitToken.serverUrl, liveKitToken.token);

      // Participants that were already in the room may be available immediately
      // after connect without producing a later ParticipantConnected event.
      for (const participant of roomInstance.remoteParticipants.values()) {
        this.addTile(participant);
        for (const publication of participant.videoTrackPublications.values()) {
          if (publication.track) {
            this.handleTrackSubscribed(participant.identity, publication.track as RemoteTrack);
          }
        }
      }

      await roomInstance.localParticipant.setCameraEnabled(true);
      await roomInstance.localParticipant.setMicrophoneEnabled(true);

      // Attach the initial local video track.
      const localVideoPublication = Array.from(roomInstance.localParticipant.videoTrackPublications.values())[0];
      if (localVideoPublication?.track) {
        setTimeout(() => {
          const localVideo = this.elRef.nativeElement.querySelector('video[data-participant-id="local"]') as HTMLVideoElement | null;
          if (localVideo) {
            localVideoPublication.track!.attach(localVideo);
          }
        }, 0);
      }

      this.isLoading.set(false);
    } catch (err: any) {
      this.isLoading.set(false);
      this.error.set(err?.message || 'Failed to join call');
    }
  }

  ngOnDestroy(): void {
    this.room()?.disconnect();
    if (!this.leaveRequested) {
      this.leaveRequested = true;
      this.roomService.leaveRoom(this.roomId()).subscribe({ error: () => {} });
    }
  }

  async leave(): Promise<void> {
    if (this.leaveRequested) return;

    this.leaveRequested = true;
    this.room()?.disconnect();
    try {
      await lastValueFrom(this.roomService.leaveRoom(this.roomId()));
    } finally {
      this.router.navigate([RouteConstants.ROOM_DETAIL_ROUTE(this.roomId())]);
    }
  }

  async toggleMic(): Promise<void> {
    const room = this.room();
    if (!room) return;

    const muted = !this.isMicMuted();
    await room.localParticipant.setMicrophoneEnabled(!muted);
    this.isMicMuted.set(muted);
  }

  async toggleCam(): Promise<void> {
    const room = this.room();
    if (!room) return;

    const off = !this.isCamOff();
    await room.localParticipant.setCameraEnabled(!off);
    this.isCamOff.set(off);
  }

  private addTile(participant: RemoteParticipant): void {
    this.tiles.update((tiles) => {
      if (tiles.some((tile) => tile.id === participant.identity)) {
        return tiles;
      }

      return [
        ...tiles,
        {
          id: participant.identity,
          isLocal: false,
          displayName: participant.name || participant.identity || 'Guest',
          hasVideo: false,
        },
      ];
    });
  }

  private removeTile(participantId: string): void {
    this.tiles.update((tiles) => tiles.filter((t) => t.id !== participantId));
  }

  private handleTrackSubscribed(participantId: string, track: RemoteTrack): void {
    this.tiles.update((tiles) =>
      tiles.map((t) => (t.id === participantId ? { ...t, hasVideo: true } : t))
    );
    setTimeout(() => {
      const videoEl = this.elRef.nativeElement.querySelector(`video[data-participant-id="${participantId}"]`) as HTMLVideoElement | null;
      if (videoEl) {
        track.attach(videoEl);
      }
    }, 0);
  }

  private handleTrackUnsubscribed(participantId: string): void {
    this.tiles.update((tiles) =>
      tiles.map((t) => (t.id === participantId ? { ...t, hasVideo: false } : t))
    );
  }
}
