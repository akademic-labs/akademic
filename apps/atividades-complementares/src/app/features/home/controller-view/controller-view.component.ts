import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Activity } from '../../../models/activity.interface';
import { User } from '../../../models/user.interface';
import { ChartData } from './../../../models/chart-data.interface';
import { ActivityService } from './../../../services/activity.service';

@Component({
  selector: 'aka-controller-view',
  templateUrl: './controller-view.component.html',
  styleUrls: ['./controller-view.component.css'],
})
export class ControllerViewComponent implements OnInit {
  @Input() user: User;

  private lastSemester = [];
  private monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  activitiesToAnalyze$: Observable<Activity[]>;
  lastSemesterChartData: ChartData;
  rankStudentsChartData: ChartData;

  constructor(
    private _activityService: ActivityService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.activitiesToAnalyze$ = this._activityService.getActivitiesToApprove();

    this.buildChartByLastSemester();
    this.buildChartRankStudents();
  }

  buildChartByLastSemester() {
    // calc of the last 6 months
    for (let i = 6; i > 0; i -= 1) {
      const d = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - i,
        1
      );
      this.lastSemester.push(this.monthNames[d.getMonth()]);
    }

    this.lastSemesterChartData = {
      labels: this.lastSemester,
      datasets: [
        {
          label: 'Último semestre',
          backgroundColor: ['rgba(75, 192, 192)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          data: [0, 10, 5, 2, 20, 30, 45],
        },
      ],
      options: {
        maintainAspectRatio: false,
      },
    };
  }

  buildChartRankStudents() {
    this.rankStudentsChartData = {
      labels: ['Juliana', 'Patrick', 'Carlos', 'Luiz', 'Helen', 'Cleverson'],
      datasets: [
        {
          label: 'Quantidade',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)',
            'rgba(75, 192, 192)',
            'rgba(153, 102, 255)',
            'rgba(255, 159, 64)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
  }

  toAnalyze(data) {
    this._router.navigate(['/controller/validate-activity/', data.uid]);
  }
}
