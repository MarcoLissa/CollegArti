import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { AuthService } from '../../services/auth.service';
import { BackgroundComponent } from "../background/background.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule,
            HeaderComponent,
            FormsModule,
            BackgroundComponent,
            MatFormFieldModule,
            MatInputModule,
            MatButtonModule],
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  event: Event = {
    id: '',
    name: '',
    eventData: new Date(), // Initial value as Date
    city: '',
    creator: '',
    creationData: new Date(), // Initial value as Date
    ArtistSlots: 0,
    Artists: [],
    creatorId: ''
  };
  error: string | null = null;

  private firestore = getFirestore();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.event.creator = user.nome || '';
        this.event.creatorId = user.uid || '';
      }
    });
    this.requestNotificationPermission();

  }

  async saveEvent() {
    try {
      const eventsCollection = collection(this.firestore, 'events');

      const eventToSave = {
        ...this.event,
        creationData: Timestamp.fromDate(new Date(this.event.creationData)),
        eventData: Timestamp.fromDate(new Date(this.event.eventData)) 
      };

      const docRef = await addDoc(eventsCollection, eventToSave);
      console.log('Event added with ID: ', docRef.id);

      this.router.navigate(['/showcase']);
    } catch (error) {
      console.error('Error adding event: ', error);
      this.error = 'Error adding event';
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission == 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }

  showNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.showNotification(title, {
            body: body,
            icon: 'assets/icons/icon-72x72.png',
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1
            }
          });
        }
      });
    }
  }
}
