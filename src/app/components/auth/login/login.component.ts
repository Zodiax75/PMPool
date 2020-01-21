import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { LoggingService } from './../../../shared/logging/log.service';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public logService: LoggingService,
    public router: Router
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
    // načti data z formuláře
    const username = signInForm.controls['username'].value;
    const passwd = signInForm.controls['password'].value;

    // přihlaš uživatele
    this.logService.log('login, onSumbit','uživatel '+username+' spustil přihlášení');

    this.authService.SignIn(username,passwd)
      .then((result) => {
        // TODO: okno s informativní hláškou co po chvíli zmizí
        this.logService.log('login, onSubmit', 'stav přihlášení uživatele '+this.authService.currentUser.email+': '+this.authService.isLoggedIn);

        // nagivate to main page
        this.router.navigate(['/']);
      })
    .catch((e) =>{
      // TODO: okno s chybovou hláškou
      this.logService.log('login, onSumbit','přihlášení uživatele '+username+' selhalo. '+e.message);
    })
  }
}
