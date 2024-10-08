import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Event } from '../../models/event.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { BackgroundComponent } from "../background/background.component"; 

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BackgroundComponent],
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css']
})
export class ShowcaseComponent implements OnInit {
  events: Event[] = [];
  error: string | null = null;
  isOrganizer: boolean = false; 

  private firestore = getFirestore();

  constructor(private router: Router, private authService: AuthService) {}

  async ngOnInit() {
    try {
      const eventsCollection = collection(this.firestore, 'events');
      const q = query(eventsCollection);
      const querySnapshot = await getDocs(q);

      this.events = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return Event.fromFirestoreData(data, doc.id);
      });
     // Subscribe to get the current user and check if they are an organizer
     this.authService.getCurrentUser().subscribe(user => {
      console.log('User data received:', user);
      if (user) {
        const mappedUser = new User(
          user.uid || '',
          user.city || '',
          user.email || null,
          user.nome || null,
          user.organizzazione || false,
          user.password || ''

        );
        console.log('Mapped User:', mappedUser);
        this.isOrganizer = mappedUser.organizzazione;
      }
    });
  } catch (error) {
    console.error('Error fetching events: ', error);
    this.error = 'Error fetching events';
  }
  }

  viewEvent(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }
  addEvent() {
    this.router.navigate(['/add-event']);
  }

}
