import { Component, inject, OnInit, signal } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { RoomResponse } from '../../services/response/room.response';
import { RoomCardComponent } from '../../components/room-card/room-card';
import { CreateRoomModalComponent } from '../../components/create-room-modal/create-room-modal';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RoomCardComponent, CreateRoomModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit {
  private readonly roomService = inject(RoomService);
  protected readonly authService = inject(AuthService);

  rooms = signal<RoomResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  showCreateModal = signal(false);

  protected readonly AppConstants = AppConstants;

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.roomService.getAllActiveRooms().subscribe({
      next: (data) => {
        this.rooms.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load rooms');
        this.isLoading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onRoomCreated(): void {
    this.showCreateModal.set(false);
    this.loadRooms();
  }
}
