import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { catchError, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Skip authentication for public endpoints
  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/products',
    '/categories'
  ];

  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  // Clone request and add authorization header if token exists and endpoint is not public
  let authReq = req;
  if (token && !authService.isTokenExpired() && !isPublicEndpoint) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      // Handle 401 Unauthorized errors only for protected endpoints
      if (error.status === 401 && !isPublicEndpoint) {
        // Try to refresh token
        if (!req.url.includes('/auth/refresh') && !req.url.includes('/auth/login')) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            return authService.refreshToken().pipe(
              switchMap(() => {
                // Retry the original request with new token
                const newToken = authService.getToken();
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(retryReq);
              }),
              catchError(refreshError => {
                // Refresh failed, logout user
                authService.logout();
                return throwError(() => refreshError);
              })
            );
          } else {
            // No refresh token, logout
            authService.logout();
          }
        } else {
          // If refresh or login failed, just logout
          authService.logout();
        }
      }
      
      return throwError(() => error);
    })
  );
};
