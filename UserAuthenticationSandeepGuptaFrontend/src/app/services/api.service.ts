import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  backendUrl = environment.backendUrl;
  private token: string | null;

  constructor(private http: HttpClient, private router: Router,private toastr : ToastrService) {
    this.token = localStorage.getItem('token');
    window.addEventListener('storage', this.storageEventHandler.bind(this));
  }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  getUserLoginRecords(userId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${this.backendUrl}/api/LoginChecks/user-logins/${userId}`, { headers });
  }

  private storageEventHandler(event: StorageEvent) {
    if (event.key === 'token' && event.oldValue !== event.newValue) {
      // Token has been modified, log out the user
      this.logout();
    }
  }

  logout():void{
    this.toastr.success("Token ALtered ! Please Login Again !")
    localStorage.removeItem('UserID');
    localStorage.removeItem('Username');
    localStorage.removeItem('token');

    sessionStorage.removeItem('UserID');
    sessionStorage.removeItem('Username');
    sessionStorage.removeItem('token');

    
    this.router.navigate(['/login']);
  }
}