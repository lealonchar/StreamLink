import { Routes } from '@angular/router';
import { RouteConstants } from './constants/route.constants';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  {
    path: RouteConstants.LOGIN,
    canActivate: [publicGuard],
    loadComponent: () => import('./core/pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: RouteConstants.REGISTER,
    canActivate: [publicGuard],
    loadComponent: () => import('./core/pages/register/register').then((m) => m.RegisterPage),
  },
  {
    path: RouteConstants.HOME,
    loadComponent: () => import('./core/pages/home/home').then((m) => m.HomePage),
  },
  {
    path: RouteConstants.MY_ROOMS,
    canActivate: [authGuard],
    loadComponent: () => import('./core/pages/my-rooms/my-rooms').then((m) => m.MyRoomsPage),
  },
  {
    path: RouteConstants.ROOM_DETAIL,
    loadComponent: () => import('./core/pages/room-detail/room-detail').then((m) => m.RoomDetailPage),
  },
  {
    path: RouteConstants.ROOM_CALL,
    canActivate: [authGuard],
    loadComponent: () => import('./core/pages/room-call/room-call').then((m) => m.RoomCallPage),
  },
  {
    path: RouteConstants.INVITE,
    loadComponent: () => import('./core/pages/invite/invite').then((m) => m.InvitePage),
  },
  {
    path: '**',
    redirectTo: RouteConstants.HOME,
    pathMatch: 'full',
  },
];
