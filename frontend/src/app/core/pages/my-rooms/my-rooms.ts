import { Component, inject, OnInit, signal } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { RoomResponse } from '../../services/response/room.response';
import { RoomCardComponent } from '../../components/room-card/room-card';
import { CreateRoomModalComponent } from '../../components/create-room-modal/create-room-modal';

@Component({
  selector: 'app-my-rooms-page',
  standalone: true,
  imports: [RoomCardComponent, CreateRoomModalComponent],
  templateUrl: './my-rooms.html',
  styleUrl: './my-rooms.scss',
})
export class MyRoomsPage implements OnInit {
  private readonly roomService = inject(RoomService);

  rooms = signal<RoomResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  showCreateModal = signal(false);

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.roomService.getMyRooms().subscribe({
      next: (data) => {
        this.rooms.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load your rooms');
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
