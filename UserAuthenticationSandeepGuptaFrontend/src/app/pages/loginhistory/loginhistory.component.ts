import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-loginhistory',
  standalone: true,
  imports: [CommonModule,MatTableModule],
  templateUrl: './loginhistory.component.html',
  styleUrl: './loginhistory.component.scss'
})
export class LoginhistoryComponent implements OnInit  {
  userLoginRecords: any[] = [];
  displayedColumns: string[] = ['loginId', 'userId', 'isValid', 'createdAt', 'loginIPAddress'];
 username!:string | null;
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    const userId = localStorage.getItem("UserID");
    this.username=localStorage.getItem("Username");
    if (userId) {
      this.fetchLoginHistory(Number(userId)); // Convert to number and call function
    } else {
      console.error('UserID not found in localStorage');
    }
 
  }
 
  fetchLoginHistory(userId: number): void {
    this.apiService.getUserLoginRecords(userId).subscribe(
      (response) => {
        this.userLoginRecords = response.$values || [];
        console.log(response);
      },
      (error) => {
        console.error('Error fetching login history:', error);
      }
    );
  }
 
 
 
}
