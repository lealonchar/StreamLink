import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiConstants } from '../../constants/api.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const isAuthRequest =
    req.url === ApiConstants.LOGIN_URL || req.url === ApiConstants.REGISTER_URL;

  if (token && !isAuthRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
