import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { LoggingService } from './../../../shared/logging/log.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { UserCustomData } from './../../../classes/UserCustomData';
import { CustomvalidationService } from './../../../shared/validation/customvalidation.service';

declare function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) : any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // vnitřní proměnné
  userDatas: UserCustomData[];
  loginForm: FormGroup;

  constructor(
    public authService: AuthenticationService,
    public logService: LoggingService,
    public router: Router,
    private fb: FormBuilder,
    public customValidator: CustomvalidationService
  ) { }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    // nastav formulář a jeho validace
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
    });
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
  }

  // vrátí aktuální formulář
  get loginFormControl() {
    return this.loginForm.controls;
  }


  // trigger when form is submitted
  onSubmit() {
    // načti data z formuláře
    const email = this.loginForm.getRawValue().email;
    const passwd = this.loginForm.getRawValue().password;

    // vytvoř kolekci pro user custom data
    var ucd: UserCustomData;

    // přihlaš uživatele
    this.logService.log('login, onSumbit','Uživatel '+email+' spustil přihlášení');
    
    if(this.loginForm.valid) {
      this.authService.SignIn(email,passwd)
        .then((result) => {
          this.logService.log('login, onSubmit', 'stav přihlášení uživatele '+email+': '+this.authService.isLoggedIn);
          showNotification('alert-success', 'Přihlášení uživatele '+email+' proběhlo úspěšně', 'bottom', 'center', 'animated zoomIn', 'animated zoomOut');

          // nagivate to main page
          this.router.navigate(['/']);
        })
        .catch((e) =>{
          this.logService.log('login, onSumbit','přihlášení uživatele '+email+' selhalo. '+e.message);
          showNotification('alert-danger', 'Přihlášení uživatele '+email+' se nezdařilo!', 'bottom', 'center', 'animated fadeInUp', 'animated fadeInOut');
        })
    }
  }
}
