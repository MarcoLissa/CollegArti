export class User {
    constructor(
      public uid: string,
      public city: string,
      public email: string | null,
      public nome: string | null,
      public organizzazione: boolean,
      public password: string
    ) {}

  static fromFirestoreData(data: any, id: string): User {
    return new User(
      id,  
      data.city || '',
      data.email || '',
      data.nome || '',
      data.organizzazione || false,
      data.password || ''
    );
  }
}

  
  