import { Project } from './../../classes/Project';
import { Injectable } from '@angular/core';
import { DashboardData } from './../../classes/dashboardData';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoggingService } from '../logging/log.service';
import { AuthenticationService } from '../authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public projectsList: Project[] = new Array();

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

  public async RefreshProjectList(ProjectName?: string ) { 
    if(typeof ProjectName == 'undefined') {
      // načti seznam projektů
      let cnt: number;
      this.logServ.log('Refresh Project list', 'Načtena celá collection Projects z DB');
      
      let col = await this.afs.collection('Projects');
      col.ref.get().then((data) => {
        data.forEach((key) => {
          let p = key.data();

          cnt = this.projectsList.push(new Project(key.id, p.Name, p.PM, p.Status, p.From, p.To, p.Allication));
          
        })
        localStorage.setItem('Projects', JSON.stringify(this.projectsList));
        
        this.logServ.log('Refresh Project list', 'Přidáno celkem '+cnt+' projektů do seznamu projektů a uloženo v lokální cache');
      })       
    } else {
      // načti konkrétní projekt
      this.logServ.log('Refresh Project list', 'Načteny informace o projektu '+ProjectName);
      return await this.afs.collection('Projects').doc(ProjectName).get().toPromise() 
    }

    
  }
}
