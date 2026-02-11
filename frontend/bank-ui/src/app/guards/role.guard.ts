import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 1) Must be logged in (checks localStorage 'token')
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  // 2) Must match role
  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const userRole = auth.getRole();

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  return true;
};
