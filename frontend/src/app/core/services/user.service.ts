import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from '../../constants/api.constants';
import { UserResponse } from './response/user.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(ApiConstants.CURRENT_USER_URL);
  }
}
