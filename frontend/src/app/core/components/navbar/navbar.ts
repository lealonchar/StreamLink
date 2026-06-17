import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppConstants } from '../../../constants/app.constants';
import { RouteConstants } from '../../../constants/route.constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly appName = AppConstants.APP_NAME;
  protected readonly routeConstants = RouteConstants;

  logout(): void {
    this.authService.logout();
  }
}
