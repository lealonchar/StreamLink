import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { CreateRoomRequest } from '../../services/request/create-room.request';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-create-room-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-room-modal.html',
  styleUrl: './create-room-modal.scss',
})
export class CreateRoomModalComponent {
  private readonly roomService = inject(RoomService);
  readonly onClose = output<void>();
  readonly onCreated = output<void>();

  name = signal('');
  description = signal('');
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  protected readonly AppConstants = AppConstants;

  submit(): void {
    const request: CreateRoomRequest = {
      name: this.name().trim(),
      description: this.description().trim() || undefined,
    };

    if (!request.name) {
      this.error.set('Room name is required');
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this.roomService.createRoom(request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.onCreated.emit();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.error.set(err.error?.message || 'Failed to create room');
      },
    });
  }

  close(): void {
    this.onClose.emit();
  }
}
