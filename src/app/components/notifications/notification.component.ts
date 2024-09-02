import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
import { Event } from '../../models/event.model';
import { AuthService } from '../../services/auth.service'; 
import { CommonModule } from '@angular/common';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HeaderComponent } from "../header/header.component";
import { BackgroundComponent } from "../background/background.component";

@Component({
  selector: 'app-notifications',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, BackgroundComponent] 
})

export class NotificationComponent implements OnInit {
  notifications$: Observable<Notification[]> = new Observable();
  receiverId: string | undefined;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    // Get the current user's ID
    this.authService.getCurrentUser().subscribe(user => {
      this.receiverId = user?.uid;

      if (this.receiverId) {
        this.notifications$ = this.notificationService.getNotificationsByReceiver(this.receiverId).pipe(
          switchMap(notifications => {
            const eventRequests = notifications.map(notification =>
              this.notificationService.getEventById(notification.eventId).pipe(
                map(event => {
                  notification['eventName'] = event ? event.name : 'Unknown Event';
                  return notification;
                })
              )
            );
            return forkJoin(eventRequests);
          })
        );
      }
    });
  }

  accept(notification: Notification): void {
    this.notificationService.acceptRequest(notification).then(() => {
      // Refresh notifications after accepting
      this.notifications$ = this.notificationService.getNotificationsByReceiver(this.receiverId!);
    });
  }

  refuse(notificationId: string): void {
    this.notificationService.refuseRequest(notificationId).then(() => {
      // Refresh notifications after refusing
      this.notifications$ = this.notificationService.getNotificationsByReceiver(this.receiverId!);
    });
  }
}
