import { User } from './../../../../classes/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Config } from '../../../../classes/config';
import { AuthenticationService } from './::/../../../::/../../../shared/authentication/auth.service';
import { LoggingService } from './../../../../shared/logging/log.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

declare function showNotification(colorName, text, placementFrom, placementAlign, animateEnter, animateExit) : any;

@Component({
  selector: 'app-navbar-left',
  templateUrl: './navbar-left.component.html',
  styleUrls: ['./navbar-left.component.css']
})
export class NavbarLeftComponent implements OnInit, OnDestroy {

  appInfo: any = Config.APP;
  user: User;
  subs: Subscription;

  constructor(
      public authService: AuthenticationService,
      public logService: LoggingService,
      public router: Router
  ) {
    // načti aktuálního uživatele
    this.user = this.authService.currentUser;
   }

  ngOnInit() {
    // subscribe na odchycení změn v CurrentUserData 
    // ! používané pouze pro funkci logout, aby se aktualizovala data ohledně uživatele
    this.logService.log('left_navbar, ngOnInit','Přihlášení k observable');
    this.subs = this.authService.CurrentUserChangedObservable.subscribe( value => {
      this.user = this.authService.currentUser;
      this.logService.log('left_navbar, ngOnInit observable','Načtena aktualizovaná data o uživateli');
    });
  }

  ngOnDestroy() {
     this.subs.unsubscribe();
    this.logService.log('left_navbar, ngOnDestroy','Zrušen observable na aktualizaci uživatelských dat');
  }
}
