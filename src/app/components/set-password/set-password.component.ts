import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, updatePassword, User as FirebaseUser } from 'firebase/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  error: string | null = null;
  success: boolean = false;

  private auth = getAuth();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Ensure the user is passed via router state
    const navigation = this.router.getCurrentNavigation();
    if (!navigation?.extras?.state) {
      this.router.navigate(['/login']);
    }
  }

  async setPassword() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match!';
      return;
    }

    try {
      const currentUser: FirebaseUser | null = this.auth.currentUser;
      if (currentUser) {
        await updatePassword(currentUser, this.password);
        this.success = true;
        this.router.navigate(['/profile']); // Redirect to profile after setting password
      }
    } catch (error) {
      console.error('Error setting password: ', error);
      this.error = 'Error setting password';
    }
  }
}
