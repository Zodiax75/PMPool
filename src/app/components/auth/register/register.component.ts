import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from './../../../core/Authentication/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthenticationService
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

    this.authService.SignUp(signUpForm.controls['email'].value, signUpForm.controls['password'].value);
  }
}
