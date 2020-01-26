import { ExamplesComponent } from './../../components/views/forms/examples/examples.component';
import { AuthenticationService } from './../authentication/auth.service';
import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  public userNameNotAvailable: boolean; 

  constructor(
    private authServ: AuthenticationService
  ) { }

  // validace hesla, zda splnuje pozadavky
  // - min 6 znaku
  // - jedno malé písmeno
  // - jedno velké písmeno
  // - jednu číslici
  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  // ověř, že se hesla rovnají
  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  // ověření dostupnosti emailu
  userNameValidator(userControl: AbstractControl) {  
    return new Promise(resolve => {
      setTimeout(() => {
        this.authServ.validateUserName(userControl.value) 
          .then((data) => {
            if(this.authServ.emailTaken) {
              this.userNameNotAvailable = true; 
              console.log('VAL: '+userControl.valid );
              
            } else {
              this.userNameNotAvailable = false;
              console.log('VAL1: '+userControl.valid);
            }

          })
       }, 1000);
    });
  }
}
