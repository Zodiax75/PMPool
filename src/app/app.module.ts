import { environment } from './../environments/environment';
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

// import general components
import { CoreModule } from './core/core.module';


@NgModule({
   declarations: [
      AppComponent
   ],
   imports: [
      BrowserModule,
      FlashMessagesModule.forRoot(),
      AuthModule,
      ViewsModule,
      CoreModule,
      AppRoutingModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
   ],
   providers: [
      ThemeHelpersService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
