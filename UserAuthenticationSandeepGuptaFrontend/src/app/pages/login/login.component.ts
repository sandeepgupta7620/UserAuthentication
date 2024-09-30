import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {publicIp} from 'public-ip';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule,ReactiveFormsModule,FormsModule,RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  count: number =0;
  email: string = '';
  password: string = '';
  captchaResponse: string | null = null;
  showCaptcha:boolean=false
  constructor(private authService: AuthService, private router: Router,private toastr : ToastrService) { }

  async onLogin(): Promise<void> {
    if (this.showCaptcha && !this.captchaResponse) {
      alert('Please complete the CAPTCHA');
      return;
    }
    var ip = await publicIp();
    if (this.email && this.password) {
      this.authService.login(this.email, this.password, ip).subscribe({
        next: async (response) => {
          // Handle successful signup
          this.count =0;
          console.log('Signup successful:', response);
          this.toastr.success('Login SuccessFull','Success');
          this.router.navigate(['/loginhistory']);
          
        },
        error: (err) => {
          // Handle error during signup
          this.count=this.count+1;
          if(this.count>2){
            this.showCaptcha=true;
          }
          console.error('Login error:', err);
          this.toastr.error('Invalid Email or Password','Error');
        }
      });
    }
  }
  onCaptchaResolved(captchaResponse: string|null) {
    this.captchaResponse = captchaResponse;
  }

  
}