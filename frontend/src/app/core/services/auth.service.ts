import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConstants } from '../../constants/api.constants';
import { AppConstants } from '../../constants/app.constants';
import { LoginRequest } from './request/login.request';
import { RegisterRequest } from './request/register.request';
import { AuthResponse } from './response/auth.response';
import { UserResponse } from './response/user.response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly currentUser = signal<UserResponse | null>(this.loadUser());
  readonly isAuthenticated = signal<boolean>(!!this.getToken());

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(ApiConstants.LOGIN_URL, request)
      .pipe(tap((response) => this.setAuth(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(ApiConstants.REGISTER_URL, request)
      .pipe(tap((response) => this.setAuth(response)));
  }

  logout(): void {
    localStorage.removeItem(AppConstants.TOKEN_STORAGE_KEY);
    localStorage.removeItem(AppConstants.USER_STORAGE_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  setAuthFromResponse(response: AuthResponse): void {
    localStorage.setItem(AppConstants.TOKEN_STORAGE_KEY, response.token);
    const user: UserResponse = {
      id: response.user_id,
      username: response.username,
      name: response.name,
      createdAt: '',
    };
    localStorage.setItem(AppConstants.USER_STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  getToken(): string | null {
    return localStorage.getItem(AppConstants.TOKEN_STORAGE_KEY);
  }

  private setAuth(response: AuthResponse): void {
    this.setAuthFromResponse(response);
  }

  private loadUser(): UserResponse | null {
    const raw = localStorage.getItem(AppConstants.USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserResponse;
    } catch {
      return null;
    }
  }
}
