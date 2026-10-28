import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  //  Check login
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  //  role based control
  const allowedRoles = route.data?.['roles'] ?? [];

  // If no roles specified then logged-in user allowed
  if (allowedRoles.length === 0) return true;

  const role = (localStorage.getItem('userRole') || '').toLowerCase(); // Owner or Supplier 

  const allowed = allowedRoles.map((r: string) => String(r).toLowerCase());
  if (!role || !allowed.includes(role)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};