import { Timestamp } from "firebase/firestore";

export class Event {
  id: string;
  name: string;
  imageUrls: string[];

  constructor(
    public ArtistSlots: number,
    public Artists: string[],
    public city: string,
    public creationData: Date,
    public creator: string,
    public creatorId:string,
    public eventData: Date,
    id: string = '', 
    name: string = '' ,
    imageUrls: string[] = []
  ) {
    this.id = id;
    this.name = name;
    this.imageUrls = imageUrls;
    
  }


  // Static method to create an instance from Firestore data
  static fromFirestoreData(data: any, id: string): Event {
    return new Event(
      data.ArtistSlots || 0,
      data.Artists || [],
      data.city || '',
      data.creationData instanceof Timestamp ? data.creationData.toDate() : new Date(data.creationData),
      data.creator || '',
      data.creatorId || '',
      data.eventData instanceof Timestamp ? data.eventData.toDate() : new Date(data.eventData),
      id, 
      data.name || '',
      data.imageUrls || [] 
    );
  }
}
