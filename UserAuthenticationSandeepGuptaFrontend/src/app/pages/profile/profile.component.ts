import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any;
  username!:string | null;
  userID!: string | null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // this.loadUser();
    this.username=localStorage.getItem("Username");
    this.userID=localStorage.getItem("UserID");
  }

  // loadUser(): void {
  //   this.authService.getUserProfile().subscribe(user => {
  //     this.user = user;
  //   });
  // }
}
