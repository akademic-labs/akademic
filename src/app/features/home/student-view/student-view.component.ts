import { UtilsService } from './../../../services/utils.service';
import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../../models/user.interface';
import { Activity } from './../../../models/activity.interface';
import { ChartData } from './../../../models/chart-data.interface';
import { ActivityService } from './../../../services/activity.service';
import { groupBy } from './../../../utils/utils';
import { MessageService } from 'primeng/components/common/api';

@Component({
  selector: 'aka-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit {
  @Input() user: User;

  activitiesStudent: Activity[];
  activityCategoryChartData: ChartData;
  activityStatusChartData: ChartData;
  activity: Activity;


  constructor(private _activityService: ActivityService, private _utilsService: UtilsService,
    private _messageService: MessageService) { }

  ngOnInit() {
    this._activityService.getActivitiesStudent(this.user.uid)
      .subscribe(responseData => {
        this.activitiesStudent = responseData;

        let dataFirebaseCategory = [];
        let dataChartCategory;
        let dataFirebaseStatus = [];
        let dataChartStatus;

        responseData.forEach(e => {
          dataFirebaseCategory.push({ activity: e.activityType.description, hours: e.hoursDuration });
          dataFirebaseCategory = groupBy(dataFirebaseCategory, 'activity', 'hours');
          dataChartCategory = this._utilsService.preparateDataChart(dataFirebaseCategory, 'activity', 'hours');

          dataFirebaseStatus.push({ status: e.status, count: 1 });
          dataFirebaseStatus = groupBy(dataFirebaseStatus, 'status', 'count');
          dataChartStatus = this._utilsService.preparateDataChart(dataFirebaseStatus, 'status', 'count');
        });

        this.buildChartByCategory(dataChartCategory);
        this.buildChartStatus(dataChartStatus);
      });
  }

  confirm(activity: Activity) {
    this.activity = activity;
    this._messageService.add({
      key: 'confirmation', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente excluir '${activity.description}'?`
    });
  }

  buildChartByCategory(dataChart) {
    this.activityCategoryChartData = {
      labels: dataChart ? dataChart.labels : null,
      datasets: [{
        data: dataChart ? dataChart.data : null,
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
        maintainAspectRatio: false,
        cutoutPercentage: 85,
      }
    }
  }

  buildChartStatus(dataChart) {
    this.activityStatusChartData = {
      labels: dataChart ? dataChart.labels : null,
      datasets: [{
        data: dataChart ? dataChart.data : null,
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

  deleteActivity() {
    this._messageService.clear();
    this._activityService.deleteActivity(this.activity.uid);
  }
}
