import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  backendUrl = environment.backendUrl;
  private userActivityTimer: any;

  constructor(private http: HttpClient,private router: Router, private toastr : ToastrService) {}

  login(email: string, password: string, ip: string): Observable<any> {
    const data = { email, passwordHash: password, signupIPAddress: ip };
    return this.http.post<any>(`${this.backendUrl}/api/users/login`, data).pipe(
      tap((response) => {
        // Store token and other user details
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('UserID', response.userID);
        localStorage.setItem('Username', response.username); // Example: storing user ID

        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('UserID', response.userID);
        sessionStorage.setItem('Username', response.username);

        const now = new Date();
        now.setTime(now.getTime() + 30 * 60 * 1000); // 30 minutes in milliseconds
        const expires = now.toUTCString();

        document.cookie = `token=${response.token}; expires=${expires}; path=/;`;
        document.cookie = `UserID=${response.userID}; expires=${expires}; path=/;`;
        document.cookie = `Username=${response.username}; expires=${expires}; path=/;`;

        this.updateUserActivity();
      }),
      catchError(this.handleError)
    );
  }

  updateUserActivity(): void {
    clearTimeout(this.userActivityTimer);
    this.userActivityTimer = setTimeout(() => {
      this.handleSessionTimeout();
    }, 30*60* 1000); // 30 minutes
  }

  signup(
    username: string,
    email: string,
    password: string,
    ip: string
  ): Observable<any> {
    const data = {
      username,
      email,
      passwordHash: password,
      signupIPAddress: ip,
    };
    return this.http
      .post<any>(`${this.backendUrl}/api/users/signup`, data)
      .pipe(catchError(this.handleError));
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.backendUrl}/api/users/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('UserID');
        localStorage.removeItem('Username');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('UserID');
        sessionStorage.removeItem('Username');
      }),
      catchError(this.handleError)
    );
  }

  // getUserProfile(): Observable<any> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   return this.http.get<any>(`${this.backendUrl}/api/users/profile`, { headers }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  private handleError(error: any) {
    // Log or handle the error as needed
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }

  handleSessionTimeout(): void {
    // Clear the stored session data
    localStorage.removeItem('token');
    localStorage.removeItem('UserID');
    localStorage.removeItem('Username');
  
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('Username');
  
    // Clear the cookies
    
  
    // Show the session timeout toastr notification with a custom OK button
    const toastrRef = this.toastr.warning(
      'Session timed out. Please log in again.', 
      'Session Timeout', 
      {
        disableTimeOut: true, // Disable automatic timeout
        closeButton: true,    // Add close button
        tapToDismiss: false,  // Don't dismiss on click outside
        enableHtml: true,     // Enable HTML for customizing message
      }
    );
  
    // Redirect to login page when toastr is closed
    toastrRef.onHidden.subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
