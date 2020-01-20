import { UserCustomData } from './../../classes/UserCustomData';
import { LoggingService } from './../logging/log.service';
import { Injectable, NgZone } from '@angular/core';
import { User } from "./../../classes/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


// TODO: vyřešit exception handling a logování

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public logServ: LoggingService
  ) {
      this.SubscribeUser();
    }

 /* Saving user data in localstorage when logged in and setting up null when logged out */
  SubscribeUser() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.logServ.log('auth_serv, constructor','user '+user.email+' uložen v paměti');
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        this.logServ.log('auth_serv, constructor','user vymazán z paměti');
      }
    });
  }


  // Sign in with email/password
  SignIn(email, password) {
    // odhlásit uživatele před přihlášením
    this.SignOut();

    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
        });
        this.SetUserData(result.user);
        this.logServ.log('auth_serv, sign in','user '+email+' přihlášen');
        this.SubscribeUser();
      }).catch((error) => {
        this.logServ.log('auth_serv, sign in','chyba při přihlášení. '+error.message);
      })
  }

  // Sign up with email/password
  SignUp(email, password) {
    // odhlaš uživatele před registrací
    this.SignOut();

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // ? Je potřeba verifikaci emailem?
        // TODO: vyřešit verifikaci emailem
        /* Call the SendVerificaitonMail() function when new user sign up and returns promise */
        // this.SendVerificationMail();
        this.SetUserData(result.user);
        this.logServ.log('auth_serv, sign up','user '+email+' vytvořen');
      }).catch((error) => {
        this.logServ.log('auth_serv, sign up','chyba při přihlášení. '+error.message);
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      // TODO: Opravit routing
      // ! this.router.navigate(['verify-email-address']);
      this.logServ.log('auth_serv, send verification email','email k verifikaci hesla odeslán')
    })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      this.logServ.log('auth_serv, forgot password','email k resetování hesla odeslán')
    }).catch((error) => {
      this.logServ.log('auth_serv, forgot password','chyba při resetování hesla. '+error.message)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
    // TODO: vyresit priznak verifikace emailu
    //return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Vrací data aktuálního uživatele nebo null pokud není přihlášen00
  get currentUser(): User {
    const user = JSON.parse(localStorage.getItem('user'));
    // TODO: vyresit priznak verifikace emailu
    return (user !== null) ? user : null;
    //return (user !== null && user.emailVerified !== false) ? user : null;
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usersData/${user.id}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }

    var result = userRef.set(userData, {merge: true});
    this.logServ.log('auth_serv, set user data','Data o uživateli uložena');
    return result;
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.logServ.log('auth_serv, sign out','Uživatel odhlášen a vymazán z local storage');
    })
  }
}
