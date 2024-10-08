import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(initializeApp(environment.firebaseConfig));
  private firestore = getFirestore(initializeApp(environment.firebaseConfig));
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private router: Router) {
    this.monitorAuthState();
  }

  private monitorAuthState(): void {
    onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {

        const userDoc = doc(this.firestore, 'users', firebaseUser.uid); 
        const userSnapshot = await getDoc(userDoc);
        const userData = userSnapshot.data();
        const user = new User(
          firebaseUser.uid,
          userData?.['city'] ?? '',  
          firebaseUser.email ?? null,
          userData?.['nome'] ?? null, 
          userData?.['organizzazione'] ?? false, 
          '' 
        );
        this.currentUserSubject.next(user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Method to sign out the user
  signOut(): void {
    signOut(this.auth)
      .then(() => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
