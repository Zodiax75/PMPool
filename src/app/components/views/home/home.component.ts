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

  constructor() { }

  ngOnInit() {
  }

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
    { data: [95, 97, 98, 95, 97, 95, 100, 95, 97, 100, 98, 95], label: 'Plánované vytížení PMs', datalabels: {color: 'rgba(55,203,221,0.6)', anchor: 'start', align: 'top', offset: 5} },
    { data: [85, 72, 78, 75, 77, 75, 90, 95, 78], label: 'Skutečné vytížení PMs', datalabels: {color: 'rgba(238,81,134,0.6', anchor: 'start', align: 'top', offset: 5} },
  ];

  PMcapacityChartLabels: Label[] = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen','Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

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

  ProjectSuccessRateChartLabels: Label[] = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen','Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];

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
}
