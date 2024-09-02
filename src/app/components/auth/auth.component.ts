import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { SignMode } from '../sign/sign.component';
import { RouterModule, Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from '../../models/user.model';
import { doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatCardModule, MatSlideToggleModule, MatCheckboxModule, MatRadioModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  @Input() mode: SignMode = SignMode.Login;
  
  private auth = getAuth(initializeApp(environment.firebaseConfig));
  private firestore = getFirestore();
  city: string = '';
  email: string = '';
  password: string = '';  // Password required for all methods
  nome: string = '';
  organizzazione: boolean = false;
  authError: string | null = null;

  constructor(private router: Router) {}
  ngOnInit() {
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

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userDocRef = doc(this.firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          // User exists in Firestore, navigate to the profile page
          const userData = userDoc.data();
          const userInstance = new User(
            user.uid,
            userData['city'],
            userData['email'],
            userData['nome'],
            userData['organizzazione'],
            userData['password']
          );
          this.navigateToProfile(userInstance);
        } else {
          // User does not exist, navigate to the set password page
          this.router.navigate(['/set-password'], {
            state: {
              uid: user.uid,
              city: this.city,
              email: user.email,
              nome: user.displayName,
              organizzazione: this.organizzazione
            }
          });
        }
      })
      .catch((error) => {
        console.error('Error during Google sign in: ', error);
        this.authError = "Errore Autenticazione";
      });
  }
  
  signInWithEmail() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((result) => {
        const userInstance = new User(result.user.uid, this.city, this.email, this.nome, this.organizzazione, this.password);
        this.navigateToProfile(userInstance);
      })
      .catch((error) => {
        console.error('Error during email sign in: ', error);
        this.authError = "Password o email non corretta";
        this.clearFields();
      });
  }
  
  signUpWithEmail() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (result) => {
        const userInstance = new User(result.user.uid, this.city, this.email, this.nome, this.organizzazione, this.password);
        await this.addUserToFirestore(userInstance);
        this.navigateToProfile(userInstance);
      })
      .catch((error) => {
        console.error('Error during email sign up: ', error);
        this.authError = "Errore durante la registrazione";
        this.clearFields();
      });
  }
  
  async addUserToFirestore(user: User) {
    try {
      await setDoc(doc(this.firestore, 'users', user.uid), {
        city: user.city,
        email: user.email,
        nome: user.nome,
        organizzazione: user.organizzazione,
        password: user.password // Store the password (hashed in a real scenario)
      });
      console.log('User added to Firestore');
    } catch (error) {
      console.error('Error adding user to Firestore: ', error);
      this.authError = "Errore durante il salvataggio dei dati utente";
    }
  }

  clearFields() {
    this.city = '',
    this.email = '';
    this.password = '';
    this.nome = '';
    this.organizzazione = false;
  }

  navigateToProfile(user: User) {
    this.router.navigate(['/profile'], { state: { user } });
  }
}
