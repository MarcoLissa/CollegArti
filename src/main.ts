import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/custom-service-worker.js').then(registration => {
      console.log('Service Worker Registered', registration);
    }).catch(error => {
      console.log('Service Worker registration failed:', error);
    });
  }
  