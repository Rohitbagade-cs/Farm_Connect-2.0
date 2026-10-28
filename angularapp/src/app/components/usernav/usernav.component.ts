
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
 
@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit {
  username: string = '';
  role: string = '';
 
  constructor(private authService: AuthService, private router: Router) { }
 
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.role = localStorage.getItem('role') || 'Organizer';
  }
 
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
