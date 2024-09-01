import { Component } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'homeBody',
  standalone: true,
  imports: [MatButtonModule,
            MatDividerModule,
            RouterModule,
            MatIconModule,
            HeaderComponent,
            FormsModule],
  templateUrl: './home-body.component.html',
})
export class HomeBodyComponent {
  name: string = '';
  email: string = '';

  constructor() { }

  ngOnInit() {
    // Request permission to send notifications
    this.requestNotificationPermission();
  }

  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }

  onSubmit() {
    // Logic to handle form submission, e.g., save data to the server
    console.log('Form submitted:', { name: this.name, email: this.email });

    // Trigger a notification upon successful submission
    this.showNotification('Form Submission', `Thank you, ${this.name}, for your submission!`);
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
