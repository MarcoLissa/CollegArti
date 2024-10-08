import { Injectable } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, arrayUnion, deleteDoc, getDoc, Timestamp, addDoc } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification } from '../models/notification.model';
import { Event } from '../models/event.model';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private firestore = getFirestore(initializeApp(environment.firebaseConfig));

  // Get notifications for a specific receiver
  getNotificationsByReceiver(receiverId: string): Observable<Notification[]> {
    const q = query(
      collection(this.firestore, 'requests'),
      where('receiverId', '==', receiverId)
    );

    return from(getDocs(q).then(querySnapshot => 
      querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          eventId: data['EventId'],
          senderId: data['senderId'],
          senderName: data['sender'] || '', 
          receiverId: data['receiverId'],
          receiverName: data['receiver'] || '',
          receivedDate: data['sentData'] instanceof Timestamp ? data['sentData'].toDate() : new Date(data['sentData']._seconds * 1000),
        } as Notification;
      })
    ));
  }

  // Accept the request and add the sender to the event
  acceptRequest(notification: Notification): Promise<void> {
    const eventRef = doc(this.firestore, `events/${notification.eventId}`);

    return updateDoc(eventRef, {
      Artists: arrayUnion(`${notification.senderId}:${notification.senderName}`)
    }).then(() => {
      const notificationRef = doc(this.firestore, `requests/${notification.id}`);
      return deleteDoc(notificationRef);
    });
  }

  // Refuse the request and delete the notification
  refuseRequest(notificationId: string): Promise<void> {
    const notificationRef = doc(this.firestore, `requests/${notificationId}`);
    return deleteDoc(notificationRef);
  }

  // Create a new notification
  sendNotification(notification: Notification): Promise<void> {
    const notificationRef = collection(this.firestore, 'requests');
    return addDoc(notificationRef, {
      eventId: notification.eventId,
      senderId: notification.senderId,
      sender: notification.senderName,
      receiverId: notification.receiverId,
      receiver: notification.receiverName,
      sentData: Timestamp.fromDate(notification.receivedDate)
    }).then(() => {
      console.log('Notification sent successfully.');
    }).catch(error => {
      console.error('Error sending notification: ', error);
    });
  }

  // Fetch event details by ID
  getEventById(eventId: string): Observable<Event | null> {
    const eventDocRef = doc(this.firestore, 'events', eventId);
    return from(getDoc(eventDocRef).then(docSnapshot => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return Event.fromFirestoreData(data, docSnapshot.id);
      } else {
        return null;
      }
    }));
  }
}
