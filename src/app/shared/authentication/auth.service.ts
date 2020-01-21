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
    // ! REP
      // this.SubscribeUser();
    }

 /* Saving user data in localstorage when logged in and setting up null when logged out */
  SubscribeUser(custData: UserCustomData) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        localStorage.setItem('userCustData', JSON.stringify(custData));
        JSON.parse(localStorage.getItem('user'));
        JSON.parse(localStorage.getItem('userCustData'));
        this.logServ.log('auth_serv, constructor','user '+user.email+' uložen v paměti');
      } else {
        localStorage.setItem('user', null);
        localStorage.setItem('userCustData', null);
        JSON.parse(localStorage.getItem('user'));
        this.logServ.log('auth_serv, constructor','user vymazán z paměti');
      }
    });
  }

  // ulož uživatelská data lokálně do paměti
  saveUserLocally(user: any, custData: UserCustomData) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userCustData', JSON.stringify(custData));
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
        });
        this.logServ.log('auth_serv, sign in','user '+email+' přihlášen');
      }).catch((error) => {
        this.logServ.log('auth_serv, sign in','chyba při přihlášení. '+error.message);
      })
  }

  // Sign up with email/password
  SignUp(email: string, password: string, userData: UserCustomData) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.logServ.log('auth_serv, sign up','Uživatel '+result.user.email+' vytvořen v databázi');
        
        // ulož uživatele do localstore
        this.saveUserLocally(result.user, userData);
        this.logServ.log('auth_serv, sign up','Uživatel '+result.user.email+' uložen v localstore');

        // ? Je potřeba verifikaci emailem?
        // TODO: vyřešit verifikaci emailem
        /* Call the SendVerificaitonMail() function when new user sign up and returns promise */
        // this.SendVerificationMail();
        
        // ulož custom uživatelská data
        this.SetUserData(result.user, userData)
          .then((result1) => {
            this.logServ.log('auth_serv, sign up','Custom data o uživateli '+result.user.email+' uložena');
          })
          .catch((error1) => {
            const errmsg = 'Chyba ukládání custom dat uřivatele '+result.user.email+'. '+error1.message;
            this.logServ.log('auth_serv, sign up',errmsg);
            error1.message = errmsg;
            throw error1;
          })
      })
      .catch((error) => {
        const errmsg = 'chyba při vytvoření uživatele. '+error.message;
        this.logServ.log('auth_serv, sign up',errmsg);
        error.message = errmsg;
        throw error;
      })
  }

  // Vrací data aktuálního uživatele nebo null pokud není přihlášen00
  get currentUser(): User {
    const user = JSON.parse(localStorage.getItem('user'));
    const userCust = JSON.parse(localStorage.getItem('userCustData'));
    
    // inicializuj uživatele
    var currUser: User = {
      uid: '',
      email: '',
      customData: {
        displayName: '',
        photoURL: '',
        role: '',
        isAdmin: false
      }
    }

    if(user !== null && userCust !== null) {
      currUser.email = user.email;
      currUser.customData.displayName = userCust.displayName;
      currUser.customData.isAdmin = userCust.isAdmin;
      currUser.customData.photoURL = userCust.photeURL;
      currUser.customData.role = userCust.role;
    } else {
      currUser = null;
    } 

    // TODO: vyresit priznak verifikace emailu
    return (currUser);
    //return (user !== null && user.emailVerified !== false) ? user : null;
  }

/* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any, usd: UserCustomData) {
    return this.afs.collection('UserCustomData').doc(user.email).set(usd);
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

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      const usr_email = this.currentUser.email;

      localStorage.removeItem('user');
      localStorage.removeItem('userCustData');
      this.logServ.log('auth_serv, sign out','Uživatel '+usr_email+' odhlášen a vymazán z local storage');
    })
  }
}
