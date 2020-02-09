import { UserCustomData } from './../../classes/UserCustomData';
import { LoggingService } from './../logging/log.service';
import { Injectable, NgZone } from '@angular/core';
import { User } from './../../classes/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { take, first } from 'rxjs/operators';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userData: any = null; // Save logged in user data
  public emailTaken: boolean;
  private ucd: UserCustomData;
  public CurrentUserChangedObservable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private afs: AngularFirestore,   // Inject Firestore service
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private ngZone: NgZone, // NgZone service to remove outside scope warning
    private logServ: LoggingService
  ) {
    // ! REP
      // this.SubscribeUser();
    }

  // ověř existenci emailu v DB
  validateUserName(userName: string) {
    let isEmailAvailable: boolean;

    return this.afAuth.auth.fetchSignInMethodsForEmail(userName)
      .then((signInMethods)=> {
          isEmailAvailable=!signInMethods.includes('password');
          if (isEmailAvailable){
            this.logServ.log('auth_serv. validate username','email '+userName+' available');
            this.emailTaken = false;
          }
          else{
              this.logServ.log('auth_serv. validate username','email '+userName+' taken');
              this.emailTaken = true;
          }
      })
      .catch((err) => {
        this.logServ.log('auth_serv. validate username','email verification for '+userName+' failed. '+err.message);
        throw(err);
      })
  }

 /* Saving user data in localstorage when logged in and setting up null when logged out */
  private SubscribeUser(custData: UserCustomData) {
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
  private saveUserLocally(user: any, custData: UserCustomData) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userCustData', JSON.stringify(custData));
    this.logServ.log('auth_serv, save user locally','Uživatelská data uložena do local store');
  }

  // Načti custom uživatelská data pro daný email
  private async ReadUserCustomData(email: string) {
    let col = await this.afs.collection('UserCustomData');
    await col.doc<UserCustomData>(email).get().toPromise()
      .then((data) => {
        const dt = data.data() as UserCustomData;

        this.ucd = {
          displayName: dt.displayName,
          role: dt.role,
          isAdmin: dt.isAdmin,
          photoURL: dt.photoURL
        }
      })
      .catch((e) => {
        this.logServ.log('auth_serv, read user cutom data','načtení custom uživatelských dat pro '+email+' selhalo. '+e.message);
        throw(e);
      })
  }

  // Sign in with email/password
  async SignIn(email, password) : Promise<any> {
    let fbLogin = await this.afAuth.auth.signInWithEmailAndPassword(email, password);


    this.ngZone.run(() => {});

    this.logServ.log('auth_serv, sign in','user '+email+' přihlášen a uživatelská data načtena');

    let a = await this.ReadUserCustomData(email);
    this.logServ.log('auth_serv, sign in','custom uživatelská data pro uživatele '+email+' načtena');

    // vymaz cache
    this.ClearLocalUserStorage();

    // uloz one do pameti
    this.saveUserLocally(fbLogin.user,this.ucd);

    this.logServ.log('auth_serv, sign in','user '+fbLogin.user.email+' přihlášen');
  }

  // Sign up with email/password
  /*
    Information on different Error Codes:
    =====================================
      auth/email-already-in-use: Thrown if there already exists an account with the given email address.
      auth/invalid-email- Thrown if the email address is not valid.
      auth/operation-not-allowed: Thrown if email/password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.
      auth/weak-password: Thrown if the password is not strong enough.
  */
  SignUp(email: string, password: string, userData: UserCustomData) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.logServ.log('auth_serv, sign up','Uživatel '+result.user.email+' vytvořen v databázi');

        // vymaz cache
        this.ClearLocalUserStorage();

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

  // ověř zda má uživatel stále platnou connection do autentikační databáze
  private async VerifyUserIsLoggedInFirebase()  {
    let user = await this.afAuth.authState.pipe(first()).toPromise();
    if (user) {
      this.logServ.log('auth_serv, Verify User Is Logged In Firebase','uživatel '+user.email+' má platnou autentikaci ve Firebase');
    } else {
      this.logServ.log('auth_serv, Verify User Is Logged In Firebase','Uživatel již nemá platnou autentikaci ve Firebase');
      this.ClearLocalUserStorage();
    }
  }

  // Vrací data aktuálního uživatele nebo null pokud není přihlášen00
  get currentUser(): User {
    let user: any = null;
    let userCust: any = null;

    if(this.isLoggedIn) {
      user = JSON.parse(localStorage.getItem('user'));
      userCust = JSON.parse(localStorage.getItem('userCustData'));
    }
    else {
      user = null;
      userCust = null;
    }

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

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    // * Zatím není zapnuto, nakolik přihlášení k Firestore vyprší až po Logoutu.
    // ! Zapnout pokud budu mít auth.state nastaven na Session
    //this.VerifyUserIsLoggedInFirebase();

    const user = JSON.parse(localStorage.getItem('user'));

    if (user !== null) {
      this.logServ.log('auth_serv, isloggedIn','uživatel '+user.email+' má data v local store ');
      return(true);
    } else {
      this.logServ.log('auth_serv, isloggedIn','uživatel nemá data v local store!');
      return(false);
    }
    // TODO: vyresit priznak verifikace emailu
    //return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut()
      .then(() => {
        const usr_email = this.currentUser.email;
        this.ClearLocalUserStorage();
        this.logServ.log('auth_serv, sign out','Uživatel '+usr_email+' odhlášen');
      })
  }

  private ClearLocalUserStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('userCustData');
    localStorage.removeItem('DashboardStats');
    
    this.logServ.log('auth_serv, Clear Local User Storage','Lokální uživatelská data byla vymazána z local storage');
  }
}
