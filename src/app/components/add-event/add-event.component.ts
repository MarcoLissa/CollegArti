import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
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
    // Get current user and set as event creator
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.event.creator = user.nome || '';
        this.event.creatorId = user.uid || '';
      }
    });
  }

  async saveEvent() {
    try {
      const eventsCollection = collection(this.firestore, 'events');

      // Convert Dates to Timestamps
      const eventToSave = {
        ...this.event,
        creationData: Timestamp.fromDate(new Date(this.event.creationData)), // Convert Date to Timestamp
        eventData: Timestamp.fromDate(new Date(this.event.eventData)) // Convert Date to Timestamp
      };

      // Add event to Firestore
      const docRef = await addDoc(eventsCollection, eventToSave);
      console.log('Event added with ID: ', docRef.id);

      // Redirect to showcase after successful save
      this.router.navigate(['/showcase']);
    } catch (error) {
      console.error('Error adding event: ', error);
      this.error = 'Error adding event';
    }
  }
}
