import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private authService : AuthService){}
  

  ngAfterViewInit(): void {
    document.addEventListener('click', () => this.authService.updateUserActivity());
    document.addEventListener('keydown', () => this.authService.updateUserActivity());
    document.addEventListener('scroll', () => this.authService.updateUserActivity());
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', () => this.authService.updateUserActivity());
    document.removeEventListener('keydown', () => this.authService.updateUserActivity());
    document.removeEventListener('scroll', () => this.authService.updateUserActivity());
  }
  title = 'UserAuthenticationSandeepGuptaFrontend';
}
