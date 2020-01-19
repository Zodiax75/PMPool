import { User } from './../../../../classes/user';
import { Component, OnInit } from '@angular/core';
import { Config } from '../../../../classes/config';
import { AuthenticationService } from './::/../../../::/../../../shared/authentication/auth.service';

@Component({
  selector: 'app-navbar-left',
  templateUrl: './navbar-left.component.html',
  styleUrls: ['./navbar-left.component.css']
})
export class NavbarLeftComponent implements OnInit {

  appInfo: any = Config.APP;
  user: User;

  constructor(
    public authService: AuthenticationService
  ) {
    // načti aktuálního uživatele
    this.user = this.authService.currentUser;
   }

  ngOnInit() {
  }

}
