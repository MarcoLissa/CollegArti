export class User {
    constructor(
      public uid: string,
      public email: string | null,
      public nome: string | null,
      public organizzazione: boolean,
      public password: string
    ) {}
  }
  