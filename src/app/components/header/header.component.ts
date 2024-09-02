import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { NgIf, CommonModule } from '@angular/common';
import { SignOutComponent } from '../sign-out/sign-out.component';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterModule, MatDividerModule, MatIconModule, CommonModule,SignOutComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}
