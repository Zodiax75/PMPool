import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { LoggingService } from './../../../shared/logging/log.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public logService: LoggingService
  ) { }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');    
  }

  // trigger when form is submitted
  onSubmit(signInForm: NgForm) {
    this.logService.log('login, onSumbit','uživatel '+signInForm.controls['username'].value+' spustil přihlášení');
    this.authService.SignIn(signInForm.controls['username'].value, signInForm.controls['password'].value);
    this.logService.log('login, onSubmit', 'stav přihlášení: '+this.authService.isLoggedIn);
  }
}
