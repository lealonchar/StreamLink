import { Component, ElementRef, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Space, SpaceEvent, getUserMedia, TrackKind } from '@mux/spaces-web';
import type { LocalParticipant, RemoteParticipant, RemoteTrack, LocalTrack } from '@mux/spaces-web';
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

  readonly roomId = input.required<number>();

  space = signal<Space | null>(null);
  localParticipant = signal<LocalParticipant | null>(null);
  tiles = signal<VideoTile[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isMicMuted = signal(false);
  isCamOff = signal(false);

  async ngOnInit(): Promise<void> {
    try {
      const muxToken = await lastValueFrom(this.roomService.getMuxToken(this.roomId()));
      if (!muxToken) {
        throw new Error('Failed to get Mux token');
      }

      const spaceInstance = new Space(muxToken.token);
      this.space.set(spaceInstance);

      spaceInstance.on(SpaceEvent.ParticipantJoined, (participant: RemoteParticipant) => {
        this.addTile(participant);
      });

      spaceInstance.on(SpaceEvent.ParticipantLeft, (participant: RemoteParticipant) => {
        this.removeTile(participant.id);
      });

      spaceInstance.on(SpaceEvent.ParticipantTrackSubscribed, (participant: RemoteParticipant, track: RemoteTrack) => {
        this.handleTrackSubscribed(participant.id, track);
      });

      spaceInstance.on(SpaceEvent.ParticipantTrackUnsubscribed, (participant: RemoteParticipant, track: RemoteTrack) => {
        this.handleTrackUnsubscribed(participant.id, track);
      });

      const local = await spaceInstance.join();
      this.localParticipant.set(local);

      const localTracks = await getUserMedia({ audio: true, video: true });
      await local.publishTracks(localTracks);

      // Attach local video
      setTimeout(() => {
        const localVideo = this.elRef.nativeElement.querySelector('video[data-participant-id="local"]') as HTMLVideoElement | null;
        if (localVideo) {
          const videoTrack = local.getVideoTracks()[0];
          if (videoTrack) {
            videoTrack.attach(localVideo);
          }
        }
      }, 0);

      this.isLoading.set(false);
    } catch (err: any) {
      this.isLoading.set(false);
      this.error.set(err?.message || 'Failed to join call');
    }
  }

  ngOnDestroy(): void {
    this.space()?.leave();
  }

  leave(): void {
    this.space()?.leave();
    this.router.navigate([RouteConstants.ROOM_DETAIL_ROUTE(this.roomId())]);
  }

  toggleMic(): void {
    const local = this.localParticipant();
    if (!local) return;
    const audioTracks = local.getAudioTracks();
    if (this.isMicMuted()) {
      audioTracks.forEach((t: LocalTrack) => t.unMute());
      this.isMicMuted.set(false);
    } else {
      audioTracks.forEach((t: LocalTrack) => t.mute());
      this.isMicMuted.set(true);
    }
  }

  toggleCam(): void {
    const local = this.localParticipant();
    if (!local) return;
    const videoTracks = local.getVideoTracks();
    if (this.isCamOff()) {
      videoTracks.forEach((t: LocalTrack) => t.unMute());
      this.isCamOff.set(false);
    } else {
      videoTracks.forEach((t: LocalTrack) => t.mute());
      this.isCamOff.set(true);
    }
  }

  private addTile(participant: RemoteParticipant): void {
    this.tiles.update((tiles) => [
      ...tiles,
      {
        id: participant.id,
        isLocal: false,
        displayName: participant.displayName || 'Guest',
        hasVideo: false,
      },
    ]);
  }

  private removeTile(participantId: string): void {
    this.tiles.update((tiles) => tiles.filter((t) => t.id !== participantId));
  }

  private handleTrackSubscribed(participantId: string, track: RemoteTrack): void {
    if (track.kind === TrackKind.Video) {
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
  }

  private handleTrackUnsubscribed(participantId: string, track: RemoteTrack): void {
    if (track.kind === TrackKind.Video) {
      this.tiles.update((tiles) =>
        tiles.map((t) => (t.id === participantId ? { ...t, hasVideo: false } : t))
      );
    }
  }
}
