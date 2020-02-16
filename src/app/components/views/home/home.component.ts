import { LoggingService } from './../../../shared/logging/log.service';
import { DashboardData } from './../../../classes/dashboardData';
import { DashboardService } from './../../../shared/dashboard/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Label, MultiDataSet, Color } from 'ng2-charts';
import { AuthenticationService } from './../../../shared/authentication/auth.service';
import { User } from './../../../classes/user';
import { Project } from './../../../classes/Project';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private projects: Project[];

  /* Doughnut graf - ROLE */
  PMrolesChartLabels: Label[]; // = ['Junior', 'Standard', 'Senior', 'Externí', 'Jiné'];
  PMrolesChartData: MultiDataSet = []; // = [[3, 5, 9, 3, 5]];
  PMrolesChartType: ChartType = 'doughnut';

  PMrolesChartOptions = {
    responsive: true,
    animation: {
      duration: 2000
    },
    legend: {
      display: true,
      position: 'right'
    }
  };
  /* END Doughnut graf - ROLE */

  /* Line graf - vytizenost */
  PMcapacityChartData: ChartDataSets[] = [
    { data: [95, 97, 98, 95, 97, 95, 100, 95, 97, 100, 98, 95],
      label: 'Plánované vytížení PMs',
      datalabels: {color: 'rgba(55,203,221,0.6)', anchor: 'start', align: 'top', offset: 5}
    },
    { data: [85, 72, 78, 75, 77, 75, 90, 95, 78],
      label: 'Skutečné vytížení PMs',
      datalabels: {color: 'rgba(238,81,134,0.6', anchor: 'start', align: 'top', offset: 5}
    }
  ];

  PMcapacityChartLabels: Label[] = [
    'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen','Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
  ];

  PMcapacityChartOptions = {
    responsive: true
  };

  PMcapacityChartColors: Color[] = [
    {
      borderColor: 'rgba(55,203,221,0.6)',
      backgroundColor: 'rgba(178,235,242,0.28)',
    },
    {
      borderColor: 'rgba(238,81,134,0.6)',
      backgroundColor: 'rgba(248,187,208,0.28)',
    },
  ];

  PMcapacityChartLegend = true;
  PMcapacityChartPlugins = [];
  PMcapacityChartType = 'line';
  /* END - Line graf - vytizenost */

  /* Line graf - uspesnost projektů */
  ProjectSuccessRateChartData: ChartDataSets[] = [
    { data: [80,90,75,93,88], label: 'Průměrné hodnocení projektů',lineTension: 0, datalabels: {display: false} }
  ];

  ProjectSuccessRateChartLabels: Label[] = [
    'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen','Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
  ];

  ProjectSuccessRateChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // udrzuj vysku manualne
    scales: {
      yAxes: [{
          display: false,
          ticks: {
              beginAtZero: true,
              suggestedMax: 100
          },
          gridLines: {
            color: 'rgba(255,255,255,1)',
          }
      }],
      xAxes: [{
        display: false,
    }]
    },
    tooltips: {
      mode: 'label'
    }
  };

  ProjectSuccessRateChartColors: Color[] = [
    {
      borderColor: 'rgba(255,255,255,1)',
      backgroundColor: 'rgba(255,255,255,0)',
    }
  ];

  ProjectSuccessRateChartLegend = false;
  ProjectSuccessRateChartPlugins = [ChartDataLabels];
  ProjectSuccessRateChartType = 'line';
  /* END - Line graf - uspesnost projektu */

  private dbData: DashboardData = {
    field1: 0,
    field2: 0,
    field3: 0,
    field4: 0
  };

  private user: User;

  constructor(
    public authService: AuthenticationService,
    private dashServ: DashboardService,
    private logServ: LoggingService
  ) {
    // načti aktuálního uživatele
    this.user = this.authService.currentUser;
   }

  ngOnInit() {
    // ověř zda jsou data pro dashboard v cache a případně je načti
    const aa = localStorage.getItem('DashboardStats');
    
    if(aa != null) {
        // načti data z cache
        this.dbData = JSON.parse(aa);
        this.logServ.log('Home (nginit)', 'Dashboard statistiky načteny z lokální cache: '+JSON.stringify(this.dbData));      
    } else {
        this.logServ.log('Home (nginit)', 'Dashboard statistiky nejsou v lokální cache');
        this.dashServ.RefreshDashboardStatistic()
          .then((data) => {
            const dbD = data.data() as DashboardData;         
            this.logServ.log('Home (nginit)', 'Dashboard statistiky načteny z databáze: '+JSON.stringify(dbD));      
            this.dbData = dbD;

            localStorage.setItem('DashboardStats', JSON.stringify(dbD));
            this.logServ.log('Home (nginit)', 'Dashboard statistiky uloženy v lokální cache');
          })
          .catch((e) => {
            this.logServ.log('Home (nginit)', 'Chyba při načítaní Dashboard statistik z DB. '+e.message);
          })
    }
    // END: dashboard statistic

    // Načti data pro PM roles statistic
    const pmroles = localStorage.getItem('PMrolesStats');
    
    if(pmroles != null) {
        // načti data z cache
        let pmr = JSON.parse(pmroles);
        this.logServ.log('Home (nginit)', 'PM roles statistiky načteny z lokální cache: '+JSON.stringify(pmr));      

        // namapuj na promenne ChartJS
        this.MapPMrolesData(pmr);
    } else {
        this.logServ.log('Home (nginit)', 'PM roles statistiky nejsou v lokální cache');

        this.dashServ.RefreshPMRolesStatistic(new Date().getFullYear())
          .then((data) => {
            let pmrolesData = JSON.stringify(data.data());
            
            this.logServ.log('Home (nginit)', 'PM roles statistiky načteny z databáze: '+pmrolesData);      
            this.MapPMrolesData(data.data());
        
            localStorage.setItem('PMrolesStats', pmrolesData);
            this.logServ.log('Home (nginit)', 'PM roles statistiky uloženy v lokální cache'); 
          })
          .catch((e) => {
            this.logServ.log('Home (nginit)', 'Chyba při načítaní PM roles statistik z DB. '+e.message);
          })
    }
    // END: PM roles statistic

    // Načti data pro Projekty
    const projs = localStorage.getItem('Projects');
        
    if(projs != null) {
        // načti data z cache
        let pmr = JSON.parse(projs);
        this.logServ.log('Home (nginit)', 'Seznam projektů načten z lokální cache');      

        this.projects = pmr;
    } else {
        this.logServ.log('Home (nginit)', 'Seznam projektů není v lokální cache');

        this.dashServ.RefreshProjectList()
         .then((data) => {
          this.projects = this.dashServ.projectsList;
        })
    }
    // END: Project list

    
  }

  // priprav data pro doughnut graf PM roles
  private MapPMrolesData(data: any) {
    this.logServ.log('Map PMroles Data', 'Mapuji PM roles statistiky: '+JSON.stringify(data));    

    this.PMrolesChartLabels = Object.keys(data);
    this.PMrolesChartData.push.apply(this.PMrolesChartData, <number[]>Object.values(data));
  }
}
