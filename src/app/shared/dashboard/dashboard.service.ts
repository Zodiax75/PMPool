import { ReadOnlyDBService } from './../readonlyDB/readOnlyDB.service';
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

  // vrať data pro dashboard statistiku
  get DashboardStatistic(): DashboardData {
    let dashboardData: DashboardData;

    // pokus se načíst data z localstorage
    dashboardData = JSON.parse(localStorage.getItem('dashboardData'));

    if(dashboardData == null) {
      this.logServ.log('DashBoardStatistic (GET)', 'Dashboard statistic data nejsou v localstorage');

      let email: string;

      if(this.authServ.isLoggedIn) {
        email = this.authServ.currentUser.email;
      } else {
        email = 'Anonymous';
      }

      // načti data z DB
      this.GetDashBoardStatistic(email)
        .then((data) => {
          const dt = data.data() as DashboardData;

          dashboardData = {
            field1: dt.field1,
            field2: dt.field2,
            field3: dt.field3,
            field4: dt.field4
          };
          this.logServ.log('GetDashBoardStatistic', 'Načtena data DashboardStatistic pro uživatele ' + email);

          console.log(dashboardData);
      })
      .catch((e) => {
        this.logServ.log('GetDashBoardStatistic','načtení dashboard statistik pro ' + email + ' selhalo. ' + e.message);
        throw(e);
      })
    }

    return(dashboardData);
  }

  // načti data z DB k dashboard statistic
  private async GetDashBoardStatistic(email: string) {
    // načti data z DB
    this.logServ.log('GetDashBoardStatistic', 'Načtena collection DashboardStatistic z DB');

    // načti detail pro daného uživatele
    return await this.afs.collection('DashboardStatistic').doc<DashboardData>(email).get().toPromise()
  }
}
