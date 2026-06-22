import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RoomService } from '../../services/room.service';
import { InviteLinkService } from '../../services/invite-link.service';
import { AuthService } from '../../services/auth.service';
import { RoomDetailResponse } from '../../services/response/room-detail.response';
import { InviteLinkResponse } from '../../services/response/invite-link.response';
import { RoomStatus } from '../../models/room-status.enum';
import { RouteConstants } from '../../../constants/route.constants';
import { ParticipantListComponent } from '../../components/participant-list/participant-list';
import { InviteCardComponent } from '../../components/invite-card/invite-card';
import { CreateInviteModalComponent } from '../../components/create-invite-modal/create-invite-modal';

@Component({
  selector: 'app-room-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe, ParticipantListComponent, InviteCardComponent, CreateInviteModalComponent],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.scss',
})
export class RoomDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly roomService = inject(RoomService);
  private readonly inviteService = inject(InviteLinkService);
  protected readonly authService = inject(AuthService);

  room = signal<RoomDetailResponse | null>(null);
  invites = signal<InviteLinkResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isHost = signal(false);
  isParticipant = signal(false);
  showInviteModal = signal(false);
  actionLoading = signal(false);

  protected readonly RoomStatus = RoomStatus;
  protected readonly RouteConstants = RouteConstants;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate([RouteConstants.HOME]);
      return;
    }
    this.loadRoom(id);
  }

  loadRoom(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.roomService.getRoomById(id).subscribe({
      next: (data) => {
        this.room.set(data);
        const currentUserId = this.authService.currentUser()?.id;
        this.isHost.set(data.createdBy.id === currentUserId);
        this.isParticipant.set(data.participants.some((participant) => participant.user.id === currentUserId));
        this.isLoading.set(false);
        if (this.isHost()) {
          this.loadInvites(id);
        }
      },
      error: () => {
        this.error.set('Room not found');
        this.isLoading.set(false);
      },
    });
  }

  loadInvites(roomId: number): void {
    this.inviteService.getRoomInvites(roomId).subscribe({
      next: (data) => this.invites.set(data),
      error: () => {},
    });
  }

  joinRoom(): void {
    const room = this.room();
    if (!room) return;

    if (this.isParticipant()) {
      this.router.navigate([RouteConstants.ROOM_CALL_ROUTE(room.id)]);
      return;
    }

    this.actionLoading.set(true);
    this.roomService.joinRoom(room.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.router.navigate([RouteConstants.ROOM_CALL_ROUTE(room.id)]);
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.error.set(err.error?.message || 'Failed to join room');
      },
    });
  }

  closeRoom(): void {
    const room = this.room();
    if (!room) return;
    this.actionLoading.set(true);
    this.roomService.closeRoom(room.id).subscribe({
      next: () => {
        this.actionLoading.set(false);
        this.router.navigate([RouteConstants.HOME]);
      },
      error: (err) => {
        this.actionLoading.set(false);
        this.error.set(err.error?.message || 'Failed to close room');
      },
    });
  }

  openInviteModal(): void {
    this.showInviteModal.set(true);
  }

  closeInviteModal(): void {
    this.showInviteModal.set(false);
  }

  onInviteCreated(): void {
    this.showInviteModal.set(false);
    const room = this.room();
    if (room) {
      this.loadInvites(room.id);
    }
  }

  revokeInvite(inviteId: number): void {
    this.inviteService.revokeInvite(inviteId).subscribe({
      next: () => {
        const room = this.room();
        if (room) {
          this.loadInvites(room.id);
        }
      },
      error: () => {},
    });
  }

  copyLink(url: string): void {
    navigator.clipboard.writeText(url);
  }
}
