import { MultiDataSet } from 'ng2-charts';
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
    this.logServ.log('Refresh Dashboard Statistic', 'Načtena collection DashboardStatistic z DB pro uživatele '+email);

    // načti detail pro daného uživatele
    return await this.afs.collection('DashboardStatistic').doc<DashboardData>(email).get().toPromise()
  }

  public async RefreshPMRolesStatistic(year?: number) {
    if(year === undefined) {
      // načti detail pro všechny roky
      this.logServ.log('Refresh PM Roles Statistic', 'Načtena collection PMRoles Statistics z DB pro všechny roky ');  
      // TODO: nacteni vsech zaznamu za vsechny roky

    } else {
      // načti detail pro daný rok
      this.logServ.log('Refresh PM Roles Statistic', 'Načtena collection PMRoles Statistics z DB pro rok '+year);
      
      return await this.afs.collection('PMsRoleStats').doc(year.toString()).get().toPromise()
    }
  }
}
