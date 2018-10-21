import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Activity } from '../../models/activity.interface';
import { User } from '../../models/user.interface';
import { UtilsService } from '../../services/utils.service';
import { ChartData } from './../../models/chart-data.interface';
import { ActivityService } from './../../services/activity.service';
import { AuthService } from './../../services/auth.service';
import { RolesService } from './../../services/roles.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'aka-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  activityCategoryChartData: ChartData;

  activityStatusChartData: ChartData;

  lastSemesterChartData: ChartData;
  private lastSemester = [];

  rankStudentsChartData: ChartData;

  activitiesToAnalyze$: Observable<Activity[]>;
  activitiesStudent: Activity[];
  user: User;

  constructor(
    private _auth: AuthService,
    private _activityService: ActivityService,
    private _router: Router,
    public _rolesService: RolesService,
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
    this._auth.user$.pipe(take(1)).subscribe(res => {
      this.user = res;
      if (this._rolesService.isController(this.user)) {
        this.activitiesToAnalyze$ = this._activityService.getActivitiesToApprove();
      }
      if (this._rolesService.isStudent(this.user)) {
        this._activityService.getActivitiesStudent(res.uid)
          .subscribe(responseData => {
            this.activitiesStudent = responseData;

            let dataFirebaseCategory = [];
            let dataChartCategory;
            let dataFirebaseStatus = [];
            let dataChartStatus;

            responseData.forEach(e => {
              dataFirebaseCategory.push({ activity: e.activityType.description, hours: e.hoursDuration });
              dataFirebaseCategory = this._utilsService.groupBy(dataFirebaseCategory, 'activity', 'hours');
              dataChartCategory = this._utilsService.preparateDataChart(dataFirebaseCategory, 'activity', 'hours');

              dataFirebaseStatus.push({ status: e.status, count: 1 });
              dataFirebaseStatus = this._utilsService.groupBy(dataFirebaseStatus, 'status', 'count');
              dataChartStatus = this._utilsService.preparateDataChart(dataFirebaseStatus, 'status', 'count');
            });

            this.buildChartByCategory(dataChartCategory);
            this.buildChartStatus(dataChartStatus);
          });
      }
      if (this._rolesService.isAdmin(this.user)) {
        // methods Admin here
      }
    });

    this.buildChartByLastSemester();
    this.buildChartRankStudents();
  }

  toAnalyze(data) {
    this._router.navigate(['validate-activity/', data.uid]);
  }

  buildChartByCategory(dataChart) {
    this.activityCategoryChartData = {
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
      }],
      options: {
        maintainAspectRatio: false
      }
    }
  }

  buildChartByLastSemester() {
    // calc of the last 6 months
    for (let i = 6; i > 0; i -= 1) {
      const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      this.lastSemester.push(this.monthNames[d.getMonth()]);
    }
    this.lastSemesterChartData = {
      labels: this.lastSemester,
      datasets: [{
        label: 'Último semestre',
        backgroundColor: ['rgba(75, 192, 192)'],
        borderColor: ['rgba(75, 192, 192, 1)'],
        data: [0, 10, 5, 2, 20, 30, 45],
      }],
      options: {
        maintainAspectRatio: false
      }
    };
  }

  buildChartRankStudents() {
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
      }],
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };
  }

  buildChartStatus(dataChart) {
    this.activityStatusChartData = {
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
      }],
      options: {
        maintainAspectRatio: false
      }
    };
  }

  ngOnDestroy() {
  }
}
