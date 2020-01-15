import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Main Modules
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './components/auth/auth.module';
import { LandingModule } from './components/landing/landing.module';
import { ViewsModule } from './components/views/views.module';

// Main Components
import { AppComponent } from './app.component';

// Services
import { ThemeHelpersService } from './helpers/theme-helpers/theme-helpers.service';

// External Modules
import { FlashMessagesModule } from 'angular2-flash-messages';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FlashMessagesModule.forRoot(),
    LandingModule,
    AuthModule,
    ViewsModule,
    AppRoutingModule,
  ],
  providers: [
    ThemeHelpersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
