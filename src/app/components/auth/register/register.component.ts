import { LoggingService } from './../../../shared/logging/log.service';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    public authService: AuthenticationService,
    public logService: LoggingService
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
    this.logService.log('registr, onSumbit','uživatel '+signUpForm.controls['email'].value+' spustil založení');
    this.authService.SignUp(signUpForm.controls['email'].value, signUpForm.controls['password'].value);
  }
}
