import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InviteLinkService } from '../../services/invite-link.service';
import { AuthService } from '../../services/auth.service';
import { InviteLinkResponse } from '../../services/response/invite-link.response';
import { InviteStatus } from '../../models/invite-status.enum';
import { RouteConstants } from '../../../constants/route.constants';

@Component({
  selector: 'app-invite-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
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

  protected readonly InviteStatus = InviteStatus;
  protected readonly RouteConstants = RouteConstants;

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
}
