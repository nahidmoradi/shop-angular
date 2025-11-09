import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // بررسی لاگین
  if (!authService.getToken() || authService.isTokenExpired()) {
    // کاربر لاگین نکرده - برو به صفحه لاگین
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // بررسی نقش ادمین
  if (authService.isAdmin()) {
    return true;
  }

  // کاربر لاگین کرده اما ادمین نیست - برو به صفحه دسترسی ندارید
  router.navigate(['/unauthorized']);
  return false;
};
