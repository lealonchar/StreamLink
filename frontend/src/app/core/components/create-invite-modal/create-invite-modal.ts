import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InviteLinkService } from '../../services/invite-link.service';
import { CreateInviteRequest } from '../../services/request/create-invite.request';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-create-invite-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-invite-modal.html',
  styleUrl: './create-invite-modal.scss',
})
export class CreateInviteModalComponent {
  private readonly inviteService = inject(InviteLinkService);
  readonly roomId = input.required<number>();
  readonly onClose = output<void>();
  readonly onCreated = output<void>();

  maxUses = signal<number | undefined>(undefined);
  expiryHours = signal<number | undefined>(undefined);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  protected readonly AppConstants = AppConstants;

  submit(): void {
    const request: CreateInviteRequest = {
      maxUses: this.maxUses(),
      expiryHours: this.expiryHours(),
    };

    this.isSubmitting.set(true);
    this.error.set(null);

    this.inviteService.createInvite(this.roomId(), request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.onCreated.emit();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.error.set(err.error?.message || 'Failed to create invite');
      },
    });
  }

  close(): void {
    this.onClose.emit();
  }
}
