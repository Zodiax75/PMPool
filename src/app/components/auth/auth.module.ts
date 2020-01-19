import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationService } from './../../core/Authentication/auth.service';
import { LoggingService } from './../../core/Log/log.service';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    LoggingService,
    AuthenticationService
  ],
  declarations: [
    AuthComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    LoginComponent
  ],
  providers: []
})
export class AuthModule { }
