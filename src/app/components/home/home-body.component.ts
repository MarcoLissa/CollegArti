import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
@Component({
  selector: 'homeBody',
  standalone: true,
  imports: [MatButtonModule,
            MatDividerModule,
            RouterModule,
            MatListModule,
            MatIconModule,
            HeaderComponent,
            MatCardModule,
            FormsModule],
            changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: './home-body.component.html',
        styleUrl: './home-body.component.css'
})
export class HomeBodyComponent {
  name: string = '';
  email: string = '';
  rating: number = 10;

  testoOrganizzazione = ` Sei un organizzazione e fatichi a trovare artisti locali
   che partecipino ai tuoi eventi? \n\nCrea subito il tuo post da fissare in bacheca e manda richieste all' elenco artisti`;
  testoArtista = ` Sei un artista in cerca di eventi nelle vicinanze a cui iscriverti?\n\n
   Registrati e manda la tua richiesta di partecipazione agli eventi di tuo interesse presenti in bacheca.`;
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
    console.log('Form submitted:', { name: this.name, email: this.email });
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
