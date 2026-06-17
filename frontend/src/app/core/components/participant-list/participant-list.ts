import { Component, input } from '@angular/core';
import { ParticipantResponse } from '../../services/response/participant.response';
import { ParticipantRole } from '../../models/participant-role.enum';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './participant-list.html',
  styleUrl: './participant-list.scss',
})
export class ParticipantListComponent {
  readonly participants = input.required<ParticipantResponse[]>();
  protected readonly ParticipantRole = ParticipantRole;
}
