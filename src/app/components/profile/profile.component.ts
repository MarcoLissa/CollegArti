import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { HeaderComponent } from '../header/header.component';
import { getAuth, updatePassword } from 'firebase/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true, 
  imports: [
    FormsModule,
    MatSlideToggleModule,
    CommonModule,
    HeaderComponent
]
})
export class ProfileComponent implements OnInit {
  user: User = {
    uid: '',
    city: '',
    nome: '',
    email: '',
    organizzazione: false,
    password: ''
  };
    updateError: string | null = null;
    updateSuccess: boolean = false;
  private firestore = getFirestore();
  private auth = getAuth();

  constructor(private router: Router, private authService: AuthService) {
    // Retrieve the User instance passed via router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.user = navigation.extras.state['user'] as User;
    }
  }
  ngOnInit(): void {
    // Subscribe to the current user from AuthService
    this.authService.getCurrentUser().subscribe((currentUser: User | null) => {
      if (currentUser) {
        this.user = currentUser;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async updateProfile() {
    if (this.user) {
      try {
        const userRef = doc(this.firestore, 'users', this.user.uid);
        await updateDoc(userRef, {
          nome: this.user.nome,
        });

        if (this.user.password) {
          const currentUser = this.auth.currentUser;
          if (currentUser) {
            await updatePassword(currentUser, this.user.password);
          }
        }
        this.updateSuccess = true;
        console.log('User profile updated successfully');
            } catch (error) {
        console.error('Error updating user profile: ', error);
        this.updateError = "Errore durante l'aggiornamento del profilo";
      }
    }
  }
}
