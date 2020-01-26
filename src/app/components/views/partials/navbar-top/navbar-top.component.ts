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

  logoutUser() {
    this.logService.log('top_navbar, Logout user','uživatel '+this.user.email+' spustil odhlášení');

    this.authService.SignOut()
      .then((result) => {
        showNotification('alert-success', 'Uživatel '+this.user.email+' úspěšně odhlášen', 'bottom', 'center', 'animated zoomIn', 'animated zoomOut');
        this.logService.log('top_navbar, logout user','Uživatel '+this.user.email+' odhlášen');

        // nagivate to main page
        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.logService.log('top_navbar, logout user','Odhlášení uživatele '+this.user.email+' selhalo. '+e.message);
        showNotification('alert-danger', 'Odhlášení uživatele '+this.user.email+' se nezdařilo!<BR><smail>'+e.message+'</smail>', 'bottom', 'center', 'animated fadeInUp', 'animated fadeInOut');
      })
  }

  ngOnInit() {
  }
}
