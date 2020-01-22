import { Router } from '@angular/router';
import { LoggingService } from './../../../../shared/logging/log.service';
import { Component, OnInit } from '@angular/core';
import { Config } from '../../../../classes/config';
import { User } from './../../../../classes/user';
import { AuthenticationService } from './../../../../shared/authentication/auth.service';

declare function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) : any;

@Component({
  selector: 'app-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.css']
})
export class NavbarTopComponent implements OnInit {

  title: String = Config.APP.title;
  user: User;

  constructor(
      public authService: AuthenticationService,
      public logService: LoggingService,
      public router: Router
    ) {
      // načti aktuálního uživatele
      this.user = this.authService.currentUser;
  }

  ngOnInit() {
  }
}
