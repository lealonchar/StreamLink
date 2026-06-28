import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InviteLinkService } from '../../services/invite-link.service';
import { AuthService } from '../../services/auth.service';
import { InviteLinkResponse } from '../../services/response/invite-link.response';
import { InviteStatus } from '../../models/invite-status.enum';
import { RouteConstants } from '../../../constants/route.constants';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-invite-page',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './invite.html',
  styleUrl: './invite.scss',
})
export class InvitePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inviteService = inject(InviteLinkService);
  protected readonly authService = inject(AuthService);

  invite = signal<InviteLinkResponse | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  isJoining = signal(false);
  guestName = signal('');

  protected readonly InviteStatus = InviteStatus;
  protected readonly RouteConstants = RouteConstants;
  protected readonly AppConstants = AppConstants;

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.router.navigate([RouteConstants.HOME]);
      return;
    }
    this.loadInvite(token);
  }

  loadInvite(token: string): void {
    this.isLoading.set(true);
    this.inviteService.getInviteByToken(token).subscribe({
      next: (data) => {
        this.invite.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invite not found');
        this.isLoading.set(false);
      },
    });
  }

  join(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) return;

    this.isJoining.set(true);
    this.inviteService.joinByInvite(token).subscribe({
      next: (room) => {
        this.isJoining.set(false);
        this.router.navigate([RouteConstants.ROOM_DETAIL_ROUTE(room.id)]);
      },
      error: (err) => {
        this.isJoining.set(false);
        this.error.set(err.error?.message || 'Failed to join');
      },
    });
  }

  joinAsGuest(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) return;

    const name = this.guestName().trim();
    if (!name) {
      this.error.set('Please enter your name');
      return;
    }

    this.isJoining.set(true);
    this.error.set(null);
    this.inviteService.joinByInviteAsGuest(token, name).subscribe({
      next: (response) => {
        this.isJoining.set(false);
        this.authService.setAuthFromResponse(response);
        const roomId = this.invite()?.roomId;
        if (roomId) {
          this.router.navigate([RouteConstants.ROOM_DETAIL_ROUTE(roomId)]);
        } else {
          this.router.navigate([RouteConstants.HOME]);
        }
      },
      error: (err) => {
        this.isJoining.set(false);
        this.error.set(err.error?.message || 'Failed to join as guest');
      },
    });
  }
}
