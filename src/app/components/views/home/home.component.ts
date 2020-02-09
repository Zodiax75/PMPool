import { LoggingService } from './../../../shared/logging/log.service';
import { DashboardData } from './../../../classes/dashboardData';
import { DashboardService } from './../../../shared/dashboard/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { ChartType, ChartDataSets } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { Label, MultiDataSet, Color } from 'ng2-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  /* Doughnut graf - ROLE */
  PMrolesChartLabels: Label[] = ['Junior', 'Standard', 'Senior', 'Externí', 'Jiné'];
  PMrolesChartData: MultiDataSet = [
    [3, 5, 9, 3, 5]
  ];
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
    { data: [95, 97, 98, 95], label: 'Průměrné hodnocení projektů',lineTension: 0, datalabels: {display: false} }
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

  dbData: DashboardData;

  constructor(
    private dashServ: DashboardService,
    private logServ: LoggingService
  ) { }

  ngOnInit() {
    // ověř zda jsou data v cache a případně je načti
    const aa = localStorage.getItem('DashboardStats');
    console.log('AA: '+aa);

    if(aa != null) {
      // načti data z cache
      console.log('AA1: '+aa);
      this.dbData = JSON.parse(aa);
      console.log('DBDBBB: '+this.dbData);
      this.logServ.log('Home (nginit)', 'Dashboard statistiky načteny z lokální cache: '+JSON.stringify(this.dbData));      
    } else {
      this.logServ.log('Home (nginit)', 'Dashboard statistiky nejsou v lokální cache');
      this.dashServ.RefreshDashboardStatistic()
        .then((data) => {
          const dbD = data.data() as DashboardData;
          console.log('DBD: '+dbD);
          

          /* this.dbData.field1 = dbD.field1;
          this.dbData.field2 = dbD.field2;
          this.dbData.field3 = dbD.field3;
          this.dbData.field4 = dbD.field4; */

          this.logServ.log('Home (nginit)', 'Dashboard statistiky načteny z databáze: '+JSON.stringify(this.dbData));

          localStorage.setItem('DashboardStats', JSON.stringify(this.dbData));
          this.logServ.log('Home (nginit)', 'Dashboard statistiky uloženy v lokální cache');
        })
        .catch((e) => {
          this.logServ.log('Home (nginit)', 'Chyba při načítaní Dashboard statistik z DB. '+e.message);
        })
    }
  }
}
