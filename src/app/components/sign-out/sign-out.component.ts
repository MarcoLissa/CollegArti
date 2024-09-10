import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { NgIf, CommonModule } from '@angular/common';
import { getAuth, signOut } from 'firebase/auth';
@Component({
  selector: 'app-sign-out',
  standalone: true,
  imports: [MatButtonModule, RouterModule, MatDividerModule, MatIconModule, CommonModule],
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent {
  private auth = getAuth();

  constructor(private router: Router) {}

  onSignOut() {
    signOut(this.auth).then(() => {
      console.log('User signed out successfully.');
      // Redirect to the login page after sign out
      this.router.navigate(['/sign'], { queryParams: { mode: 'Login' } });
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  }
}
