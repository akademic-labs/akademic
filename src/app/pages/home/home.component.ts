import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartType } from 'app/shared/chart-card/chart-card/chart-card.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Activity } from './../../models/activity.interface';
import { User } from '../../models/user.interface';
import { ActivityService } from 'app/services/activity.service';
import { AuthService } from 'app/services/auth.service';
import { RolesService } from './../../services/roles.service';
import Chart = require('chart.js');

@Component({
  selector: 'aka-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  public activityCategoryChartType: ChartType;
  public activityCategoryChartData: any;
  public activityCategoryChartOptions: any;

  public activityStatusChartType: ChartType;
  public activityStatusChartData: any;
  public activityStatusChartOptions: any;

  public lastSemesterChartType: ChartType;
  public lastSemesterChartData: any;
  public lastSemesterChartOptions: any;
  private lastSemester = [];

  public rankStudentsChartType: ChartType;
  public rankStudentsChartData: any;
  public rankStudentsChartOptions: any;

  activitiesToAnalyze$: Observable<Activity[]>
  activitiesStudent$: Activity[];
  user: User;

  @ViewChild('lineCanvas') lineCanvas;
  private barChart: any;
  labels = [];

  constructor(
    private _auth: AuthService,
    private _activityService: ActivityService,
    private _router: Router,
    public _rolesService: RolesService
  ) { }

  ngOnInit() {
    this._auth.user$.subscribe(res => {
      this.user = res;
      if (this._rolesService.isController(this.user)) {
        this.activitiesToAnalyze$ = this._activityService.getActivitiesToApprove();
      }
      if (this._rolesService.isStudent(this.user)) {
        this._activityService.getActivitiesStudent(res.uid)
          .subscribe(data => {
            this.activitiesStudent$ = data;
            this.labels = data.map(e => e.activityType.description);
            this.labels = this.labels.filter((v, i, a) => a.indexOf(v) === i);
            // console.log(this.labels);
            const datas = [12, 19, 3];
            this.chartTest(this.labels, datas);
          });
      }
      if (this._rolesService.isAdmin(this.user)) {
        // methods Admin here
      }
    });

    // CHART ACTIVITY PER CATEGORY
    this.activityCategoryChartType = ChartType.Pie;
    this.activityCategoryChartData = {
      labels: ['Palestra', 'Curso Extensão', 'Monitoria'],
      datasets: [
        {
          data: [32, 6, 62],
          backgroundColor: [
            'rgba(255,99,132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)'
          ],
          borderColor: [
            'rgba(255,99,132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1,
          hoverBorderWidth: 2
        }
      ]
    };
    this.activityCategoryChartOptions = {
      maintainAspectRatio: false
    }

    // CHART ACTIVITY PER STATUS
    this.activityStatusChartType = ChartType.Doughnut;
    this.activityStatusChartData = {
      datasets: [{
        data: [11, 4, 2],
        backgroundColor: [
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255,99,132)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255,99,132, 1)'
        ],
      }],
      labels: [
        'Aprovada',
        'Pendente',
        'Reprovada'
      ]
    };
    this.activityStatusChartOptions = {
      maintainAspectRatio: false
    }

    // CHART ACTIVITY LAST 6 SEMESTERS
    // calc of the last 6 months
    for (let i = 6; i > 0; i -= 1) {
      const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      this.lastSemester.push(this.monthNames[d.getMonth()]);
    }
    this.lastSemesterChartType = ChartType.Line;
    this.lastSemesterChartData = {
      labels: this.lastSemester,
      datasets: [{
        label: 'Último semestre',
        backgroundColor: 'rgba(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 1)',
        data: [0, 10, 5, 2, 20, 30, 45],
      }]
    };
    this.lastSemesterChartOptions = {
      maintainAspectRatio: false
    }

    // CHART RANK STUDENTS
    this.rankStudentsChartType = ChartType.Bar;
    this.rankStudentsChartData = {
      labels: ['Juliana', 'Patrick', 'Carlos', 'Luiz', 'Helen', 'Cleverson'],
      datasets: [{
        label: 'Quantidade',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255, 159, 64)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    };
    this.rankStudentsChartOptions = {
      // maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };

  }

  toAnalyze(data) {
    this._router.navigate(['validate-activity', { id: data.uid }]);
  }

  toEdit(data) {
    this._router.navigate(['input-activity', { id: data.uid }]);
  }

   chartTest(labels, datas) {
    this.barChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: datas,
          backgroundColor: [
            'rgba(255,99,132)',
            'rgba(54, 162, 235)',
            'rgba(255, 206, 86)'
          ],
          borderColor: [
            'rgba(255,99,132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1,
          hoverBorderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false
      }
    });
  }
}
