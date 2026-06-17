import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../services/request/register.request';
import { RouteConstants } from '../../../constants/route.constants';
import { AppConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = signal('');
  password = signal('');
  name = signal('');
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  protected readonly RouteConstants = RouteConstants;
  protected readonly AppConstants = AppConstants;

  submit(): void {
    const request: RegisterRequest = {
      username: this.username().trim(),
      password: this.password(),
      name: this.name().trim(),
    };

    if (!request.username || !request.password || !request.name) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this.authService.register(request).subscribe({
      next: () => {
        this.router.navigate([RouteConstants.HOME]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.error.set(err.error?.message || 'Registration failed');
      },
    });
  }
}
