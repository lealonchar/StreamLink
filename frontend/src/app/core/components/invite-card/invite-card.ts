import { Component, input, output } from '@angular/core';
import { InviteLinkResponse } from '../../services/response/invite-link.response';
import { InviteStatus } from '../../models/invite-status.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invite-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './invite-card.html',
  styleUrl: './invite-card.scss',
})
export class InviteCardComponent {
  readonly invite = input.required<InviteLinkResponse>();
  readonly canRevoke = input<boolean>(false);
  readonly onRevoke = output<number>();
  readonly onCopy = output<string>();
  protected readonly InviteStatus = InviteStatus;

  revoke(): void {
    this.onRevoke.emit(this.invite().id);
  }

  copyLink(): void {
    const url = `${window.location.origin}/invites/${this.invite().token}`;
    this.onCopy.emit(url);
  }
}
