import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getFirestore, doc, getDoc, collection, Timestamp, addDoc } from 'firebase/firestore';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { BackgroundComponent } from "../background/background.component";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateDoc, arrayUnion,  } from 'firebase/firestore';

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
  isEventCreator: boolean = false; 
  currentUser: User | null = null;
  uploading: boolean = false;

  private firestore = getFirestore();
  private storage = getStorage();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      try {
        // Fetch the event document from Firestore
        const eventDoc = await getDoc(doc(this.firestore, 'events', eventId));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          this.event = Event.fromFirestoreData(eventData, eventDoc.id);

          // Check if the current user is the event creator
          this.authService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
            if (user) {
              this.isArtist = !user.organizzazione; 
              this.isEventCreator = user.uid === this.event?.creatorId; 
            }
          });

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
  }
onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.uploading = true;
      const uploadPromises = Array.from(files).map(file => this.uploadFile(file));
      Promise.all(uploadPromises).then(() => {
        this.uploading = false;
        alert('All files uploaded successfully!');
      }).catch(err => {
        this.uploading = false;
        this.error = 'Error uploading files';
        console.error(err);
      });
    }
  }

  async uploadFile(file: File) {
    if (!this.event) return;

    const storageRef = ref(this.storage, `events/${this.event.id}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<void>((resolve, reject) => {
      uploadTask.on('state_changed', 
        () => {}, 
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(this.firestore, 'events', this.event!.id), {
            imageUrls: arrayUnion(downloadURL)
          });
          this.event?.imageUrls.push(downloadURL);
          resolve();
        }
      );
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
        sentData: Timestamp.fromDate(new Date()),
        EventId: this.event.id,
        receiver: this.event.creator,
        sender: this.currentUser.nome,
        receiverId: this.event.creatorId,
        senderId: this.currentUser.uid 
      };

      await addDoc(requestsCollection, requestPayload);
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending participation request: ', error);
      this.error = 'Error sending participation request';
    }
  }
}
