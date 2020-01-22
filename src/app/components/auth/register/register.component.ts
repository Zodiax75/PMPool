import { UserCustomData } from './../../../classes/UserCustomData';
import { LoggingService } from './../../../shared/logging/log.service';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { collectExternalReferences } from '@angular/compiler';

declare function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) : any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userDatas: UserCustomData[];

  constructor(
    public authService: AuthenticationService,
    public logService: LoggingService,
    public router: Router
  ) {
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('signup-page');
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('signup-page');
  }

  // trigger when form is submitted
  onSubmit(signUpForm: NgForm) {

    // načti data z formuláře
    const email = signUpForm.controls['email'].value;
    const passwd = signUpForm.controls['password'].value;
    const namesurname = signUpForm.controls['namesurname'].value;

    // vytvoř kolekci pro user custom data
    // TODO: doladit nacteni custom dat
    const ucd: UserCustomData = {
      displayName: namesurname,
      photoURL: 'picture.jpg',
      role: 'PM junior',
      isAdmin: false
    }

    // založ uživatele
    this.logService.log('registr, onSumbit','uživatel '+email+' spustil založení');

    this.authService.SignUp(email, passwd, ucd)
      .then((result) => {
        showNotification('alert-success', 'Registrace uživatele '+email+' proběhla úspěšně', 'bottom', 'center', 'animated zoomIn', 'animated zoomOut');
        this.logService.log('registr, onSumbit','uživatel '+email+' založen a přihlášen');

        // nagivate to main page
        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.logService.log('registr, onSumbit','založení uživatele '+email+' selhalo. '+e.message);
        showNotification('alert-danger', 'Registrace uživatele '+email+' se nezdařila!', 'bottom', 'center', 'animated zoomIn', 'animated zoomOut');
      })
  }
}
