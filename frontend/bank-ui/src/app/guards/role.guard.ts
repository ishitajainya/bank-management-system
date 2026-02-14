import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Must be logged in (robust)
  if (!auth.isLoggedIn()) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  //  Find roles on this route OR any parent route
  const allowedRoles =
    (route.data?.['roles'] as string[] | undefined) ??
    (route.parent?.data?.['roles'] as string[] | undefined) ??
    route.pathFromRoot
      .map(r => r.data?.['roles'] as string[] | undefined)
      .find(Boolean);

  const userRole = auth.getRole();

  //  Debug (remove later)
  console.log('[roleGuard]', state.url, { allowedRoles, userRole });

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  return true;
};
