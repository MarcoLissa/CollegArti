import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'collegArti';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to the user observable and set isLoggedIn based on the user state
    this.authService.getCurrentUser().subscribe((user: User | null) => {
      this.isLoggedIn = user !== null;
    });
  }
}
