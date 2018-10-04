import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ChartType } from 'app/shared/chart-card/chart-card/chart-card.component';

import { User } from '../../models/user.interface';
import { Activity } from '../../models/activity.interface';
import { ActivityService } from 'app/services/activity.service';
import { AuthService } from 'app/services/auth.service';
import { RolesService } from './../../services/roles.service';
import { UtilsService } from '../../services/utils.service';

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

  @ViewChild('categoryCanvas') categoryCanvas;
  public categoryChart: any;
  @ViewChild('statusCanvas') statusCanvas;
  public statusChart: any;

  constructor(
    private _auth: AuthService,
    private _activityService: ActivityService,
    private _router: Router,
    public _rolesService: RolesService,
    private _utilsService: UtilsService
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

            let dataFirebaseCategory = [];
            let dataChartCategory;
            let dataFirebaseStatus = [];
            let dataChartStatus;

            data.forEach(e => {
              dataFirebaseCategory.push({ activity: e.activityType.description, hours: e.hoursDuration });
              dataFirebaseCategory = this._utilsService.groupBy(dataFirebaseCategory, 'activity', 'hours');
              dataChartCategory = this._utilsService.preparateDataChart(dataFirebaseCategory, 'activity', 'hours');

              dataFirebaseStatus.push({ status: e.status, count: 1 });
              dataFirebaseStatus = this._utilsService.groupBy(dataFirebaseStatus, 'status', 'count');
              dataChartStatus = this._utilsService.preparateDataChart(dataFirebaseStatus, 'status', 'count');
            });

            console.log(dataFirebaseCategory);
            console.log(dataChartCategory);
            console.log(dataFirebaseStatus);
            console.log(dataChartStatus);

            this.buildChartCategory(dataChartCategory);
            this.buildChartStatus(dataChartStatus);
          });
      }
      if (this._rolesService.isAdmin(this.user)) {
        // methods Admin here
      }
    });

    // this.buildChartByCategory();
    // this.buildCByStatus();
    this.buildChartByLastSemester();
    this.buildChartRankStudents();
  }

  toAnalyze(data) {
    this._router.navigate(['validate-activity', { id: data.uid }]);
  }

  toEdit(data) {
    this._router.navigate(['input-activity', { id: data.uid }]);
  }

  buildChartByCategory() {
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
  }

  buildCByStatus() {
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
  }

  buildChartByLastSemester() {
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
  }

  buildChartRankStudents() {
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

  buildChartCategory(dataChart) {
    this.categoryChart = new Chart(this.categoryCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: dataChart.labels,
        datasets: [{
          data: dataChart.data,
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

  buildChartStatus(dataChart) {
    this.statusChart = new Chart(this.statusCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: dataChart.labels,
        datasets: [{
          data: dataChart.data,
          backgroundColor: [
            'rgba(153, 102, 255)',
            'rgba(75, 192, 192)',
            'rgba(255,99,132)'
          ],
          borderColor: [
            'rgba(153, 102, 255, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255,99,132, 1)'
          ],
        }]
      },
      options: {
        maintainAspectRatio: false
      }
    });
  }

}
