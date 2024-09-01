import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getFirestore, doc, getDoc, collection, Timestamp, addDoc } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { BackgroundComponent } from "../background/background.component";

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BackgroundComponent],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  event: Event | null = null;
  error: string | null = null;
  isArtist: boolean = false;
  currentUser: User | null = null;

  private firestore = getFirestore();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Get the event ID from the route parameters
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      try {
        // Fetch the event document from Firestore
        const eventDoc = await getDoc(doc(this.firestore, 'events', eventId));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          this.event = Event.fromFirestoreData(eventData, eventDoc.id);
        } else {
          this.error = 'Event not found';
        }
      } catch (error) {
        console.error('Error fetching event details: ', error);
        this.error = 'Error fetching event details';
      }
    } else {
      this.error = 'Invalid event ID';
    }

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user && !user.organizzazione) {
        this.isArtist = true; // User is an artist
      }
    });

  }

  // Method to navigate back to the showcase
  goBack() {
    this.router.navigate(['/showcase']);
  }

  async sendParticipationRequest() {
    if (!this.currentUser || !this.event) return;

    try {
      const requestsCollection = collection(this.firestore, 'requests');
      const requestPayload = {
        sentData: Timestamp.fromDate(new Date()), // Current time
        EventId: this.event.id,
        receiver: this.event.creator,
        sender: this.currentUser.nome, // Assuming 'nome' is the user's name
        receiverId: this.event.creatorId, // Assuming creatorId is available in event model
        senderId: this.currentUser.uid // Current user's ID
      };

      await addDoc(requestsCollection, requestPayload);
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending participation request: ', error);
      this.error = 'Error sending participation request';
    }
  }
}
