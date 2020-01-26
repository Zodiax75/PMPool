import { UserCustomData } from './../../../classes/UserCustomData';
import { LoggingService } from './../../../shared/logging/log.service';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Router } from "@angular/router";
import { CustomvalidationService } from './../../../shared/validation/customvalidation.service';

declare function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) : any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // vnitřní proměnné
  userDatas: UserCustomData[];
  registerForm: FormGroup;
  submitted = false;

  constructor(
    public authService: AuthenticationService,
    public logService: LoggingService,
    public router: Router,
    private fb: FormBuilder,
    public customValidator: CustomvalidationService
  ) {
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('signup-page');

    // nastav formulář a jeho validace
    this.registerForm = this.fb.group({
      namesurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]/* ,this.customValidator.userNameValidator.bind(this.customValidator) */],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      }
    );
  }

  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('signup-page');
  }

  // vrátí aktuální formulář
  get registerFormControl() {
    return this.registerForm.controls;
  }

  // trigger when form is submitted
  onSubmit() {

    // načti data z formuláře
    const email = this.registerForm.getRawValue().email;
    const passwd = this.registerForm.getRawValue().password;
    const namesurname = this.registerForm.getRawValue().namesurname;

    // vytvoř kolekci pro user custom data
    const ucd: UserCustomData = {
      displayName: namesurname,
      photoURL: 'picture.jpg',
      role: '',
      isAdmin: false
    }

    this.logService.log('registr, onSumbit','uživatel '+email+' spustil založení');

    // validuj existenci zadaného emailu
    this.authService.validateUserName(email)
      .then((data) => {
        if(this.authService.emailTaken) {
          // email již existuje, nezakládej uživatele
          this.logService.log('registr, onSumbit','Email '+email+' je již používán. ');
          showNotification('alert-danger', 'Email '+email+' je již registrován. Zapomněli jste heslo?', 'bottom', 'center', 'animated fadeInUp', 'animated fadeInOut');
        } else {
          // email neexistuje, založ uživatele
          this.submitted = true;
          if (this.registerForm.valid) {
            this.authService.SignUp(email, passwd, ucd)
              .then((result) => {
                showNotification('alert-success', 'Registrace uživatele '+email+' proběhla úspěšně', 'bottom', 'center', 'animated zoomIn', 'animated zoomOut');
                this.logService.log('registr, onSumbit','uživatel '+email+' založen a přihlášen');

                // nagivate to main page
                this.router.navigate(['/']);
              })
              .catch((e) => {
                this.logService.log('registr, onSumbit','založení uživatele '+email+' selhalo. '+e.message);
                showNotification('alert-danger', 'Registrace uživatele '+email+' se nezdařila!<BR><smail>'+e.message+'</smail>', 'bottom', 'center', 'animated fadeInUp', 'animated fadeInOut');
              })
          }
        }
      })
      .catch((e) => {
        this.logService.log('registr, onSumbit','Verifikace emailu '+email+' selhalo. '+e.message);
        showNotification('alert-danger', 'Validace emailu uživatele '+email+' se nezdařila!<BR><smail>'+e.message+'</smail>', 'bottom', 'center', 'animated fadeInUp', 'animated fadeInOut');
      })
  }
}
