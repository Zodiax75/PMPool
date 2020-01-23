import { UserCustomData } from './../../../classes/UserCustomData';
import { LoggingService } from './../../../shared/logging/log.service';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Router } from "@angular/router";
import { CustomvalidationService } from './../../../shared/validation/customvalidation.service';
import { database } from 'firebase';


declare function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) : any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Input() passengregForm: FormGroup;

  // vnitřní proměnné
  userDatas: UserCustomData[];
  registerForm: FormGroup;
  submitted = false;

  constructor(
    public authService: AuthenticationService,
    public logService: LoggingService,
    public router: Router,
    private fb: FormBuilder,
    private customValidator: CustomvalidationService
  ) {
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('signup-page');

    // nastav formulář a jeho validace
    this.registerForm = this.fb.group({
      namesurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email],this.customValidator.userNameValidator.bind(this.customValidator)],
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

    console.log('on submit: '+this.registerForm.valid);
    

    // načti data z formuláře
    /* const email = signUpForm.controls['email'].value;
    const passwd = signUpForm.controls['password'].value;
    const namesurname = signUpForm.controls['namesurname'].value; */

    // vytvoř kolekci pro user custom data
    // TODO: doladit nacteni custom dat
    /* const ucd: UserCustomData = {
      displayName: namesurname,
      photoURL: 'picture.jpg',
      role: 'PM junior',
      isAdmin: false
    } */

    // založ uživatele
    /* this.logService.log('registr, onSumbit','uživatel '+email+' spustil založení'); */

    /* this.submitted = true;
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
    } */
  }
}
