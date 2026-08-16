import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protects the staff/user area. Redirects unauthenticated visitors to /login. */
export const userGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.hasRole('user') ? true : router.createUrlTree(['/login']);
};

/** Protects the admin area. Redirects unauthenticated visitors to /admin/login. */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.hasRole('admin') ? true : router.createUrlTree(['/admin/login']);
};
