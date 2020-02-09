import { Injectable } from '@angular/core';
import { DashboardData } from './../../classes/dashboardData';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoggingService } from '../logging/log.service';
import { AuthenticationService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private afs: AngularFirestore,
    private logServ: LoggingService,
    private authServ: AuthenticationService
  ) {

  }

  // obnov data pro dashboard statistiku
  public async RefreshDashboardStatistic() {
      let email: string;

      if(this.authServ.isLoggedIn) {
        email = this.authServ.currentUser.email;
      } else {
        email = 'Anonymous';
      }

      // načti data z DB
    this.logServ.log('Refresh Dashboard Statistic', 'Načtena collection DashboardStatistic z DB');

    // načti detail pro daného uživatele
    return await this.afs.collection('DashboardStatistic').doc<DashboardData>(email).get().toPromise()
  }
}
