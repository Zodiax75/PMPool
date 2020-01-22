import { User } from './../../../../classes/user';
import { Component, OnInit } from '@angular/core';
import { Config } from '../../../../classes/config';
import { AuthenticationService } from './::/../../../::/../../../shared/authentication/auth.service';
import { LoggingService } from './../../../../shared/logging/log.service';
import { Router } from '@angular/router';

declare function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) : any;

@Component({
  selector: 'app-navbar-left',
  templateUrl: './navbar-left.component.html',
  styleUrls: ['./navbar-left.component.css']
})
export class NavbarLeftComponent implements OnInit {

  appInfo: any = Config.APP;
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

  // odhlaš současného uživatele
  logoutUser() {
    this.authService.SignOut()
      .then((result) => {
        showNotification('alert-success', 'Uživatel '+this.user.email+' úspěšně odhlášen', 'bottom', 'center', 'animated zoomIn', 'animated zoomOut');
        this.logService.log('navbar_left, logoutUser','uživatel '+this.user.email+' odhlášen');

        // nagivate to main page
        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.logService.log('navbar_left, logoutUser','uživatel '+this.user.email+' nebyl odhlášen! '+e.message);
        showNotification('alert-danger', 'Odhlášení uživatele '+this.user.email+' se nezdařilo!<BR><smail>'+e.message+'</smail>', 'bottom', 'center', 'animated fadeInUp', 'animated fadeInOut');
      })
  }
}
