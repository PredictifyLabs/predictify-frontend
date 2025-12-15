import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Only redirect for navigation requests, not API calls
      const isApiCall = req.url.includes('/api/');
      
      switch (error.status) {
        case 401:
          // Unauthorized - don't redirect, let components handle it
          break;
        case 403:
          // Only redirect for non-API calls
          if (!isApiCall) {
            router.navigate(['/error/403']);
          }
          break;
        case 404:
          if (!isApiCall) {
            router.navigate(['/error/404']);
          }
          break;
        case 500:
        case 502:
        case 503:
          if (!isApiCall) {
            router.navigate(['/error/500']);
          }
          break;
      }
      return throwError(() => error);
    })
  );
};
