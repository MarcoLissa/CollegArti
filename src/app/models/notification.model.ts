import { Timestamp } from "firebase/firestore";
export interface Notification {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  receivedDate: Date;
}


// notification.model.ts
export class Notification {
    id: string;
    eventId: string;
    eventName: string;
    senderId: string;
    senderName: string;
    receiverId: string;
    receiverName: string;
    receivedDate: Date;
  
    constructor(
      id: string,
      eventId: string,
      eventName: string,
      senderId: string,
      senderName: string,
      receiverId: string,
      receiverName: string,
      receivedDate: Date
    ) {
      this.id = id;
      this.eventId = eventId;
      this.eventName = eventName;
      this.senderId = senderId;
      this.senderName = senderName;
      this.receiverId = receiverId;
      this.receiverName = receiverName;
      this.receivedDate = receivedDate;
    }
  
    static fromFirestoreData(data: any, id: string): Notification {
      return new Notification(
        id,
        data.eventId || '',
        data.eventName || '',
        data.senderId || '',
        data.senderName || '',
        data.receiverId || '',
        data.receiverName || '',
        data.receivedDate instanceof Timestamp ? data.receivedDate.toDate() : new Date(data.receivedDate)
      );
    }
  }
  