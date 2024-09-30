import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router : Router){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string | null = localStorage.getItem('token');    if (token !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && token !== null) {
          // Check if the token has expired
          const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp;
          if (tokenExpiration < Date.now() / 1000) {
            this.logout();
          }
        }
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401 && token !== null) {
          this.logout();
        }
        return throwError(error);
      })
    );
  }

  private logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('UserID');
    localStorage.removeItem('Username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('Username');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    document.cookie = 'UserID=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    document.cookie = 'Username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    // Redirect to login page or perform any other logout logic
    this.router.navigate(['/login']);
  }
}