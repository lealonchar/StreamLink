import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../services/request/login.request';
import { RouteConstants } from '../../../constants/route.constants';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = signal('');
  password = signal('');
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  protected readonly RouteConstants = RouteConstants;
  protected readonly AppConstants = AppConstants;

  submit(): void {
    const request: LoginRequest = {
      username: this.username().trim(),
      password: this.password(),
    };

    if (!request.username || !request.password) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this.authService.login(request).subscribe({
      next: () => {
        this.router.navigate([RouteConstants.HOME]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.error.set(err.error?.message || 'Invalid username or password');
      },
    });
  }
}
