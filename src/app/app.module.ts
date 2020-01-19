import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Main Modules
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './components/auth/auth.module';
import { ViewsModule } from './components/views/views.module';

// Main Components
import { AppComponent } from './app.component';

// Services
import { ThemeHelpersService } from './helpers/theme-helpers/theme-helpers.service';

// External Modules
import { FlashMessagesModule } from 'angular2-flash-messages';

import { environment } from './../environments/environment';

// Import Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      BrowserModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFirestoreModule,
      FlashMessagesModule.forRoot(),
      AuthModule,
      ViewsModule,
      AppRoutingModule
   ],
   providers: [
      ThemeHelpersService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
