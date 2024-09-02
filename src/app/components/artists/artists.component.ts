import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { BackgroundComponent } from '../background/background.component'; 
import { User } from '../../models/user.model';  // Ensure this path is correct
import { AuthService } from '../../services/auth.service';  // Ensure this path is correct
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BackgroundComponent,MatButtonModule,
    MatDividerModule,MatIconModule,MatCardModule,MatListModule,MatToolbarModule
  ],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  artists: User[] = [];
  error: string | null = null;
  isOrganizer: boolean = false; 
  private firestore = getFirestore();

  constructor(private router: Router, private authService: AuthService) {}

  async ngOnInit() {
    try {
      // Fetch users from Firestore
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection);  // Optionally, add a filter here if needed
      const querySnapshot = await getDocs(q);

      // Map documents to User objects
      this.artists = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return User.fromFirestoreData(data, doc.id);  // Make sure `fromFirestoreData` is defined correctly
      });

      // Get the current user and check if they are an organizer
      this.authService.getCurrentUser().subscribe(user => {
        if (user) {
          const mappedUser = new User(
            user.uid || '',
            user.city || '',
            user.email || null,
            user.nome || null,
            user.organizzazione || false,
            user.password || ''
          );
          this.isOrganizer = mappedUser.organizzazione;
        }
      });

    } catch (error) {
      console.error('Error fetching artists: ', error);
      this.error = 'Error fetching artists';
    }
  }


}
