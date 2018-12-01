import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/api';

import { User } from '../../../models/user.interface';
import { Activity } from './../../../models/activity.interface';
import { ChartData } from './../../../models/chart-data.interface';
import { ActivityService } from './../../../services/activity.service';
import { UtilsService } from './../../../services/utils.service';
import { groupBy } from './../../../utils/utils';
import { NotifyService } from 'app/services/notify.service';
import { Router } from '@angular/router';

declare var palette: any;

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
    private _messageService: MessageService, private _notify: NotifyService, private _router: Router) { }

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
    dataChart ? this.activityCategoryChartData = {
      labels: dataChart.labels,
      datasets: [{
        data: dataChart.data,
        backgroundColor: palette('cb-Pastel1', dataChart.data.length).map(hex => '#' + hex),
        borderColor: palette('cb-Pastel1', dataChart.data.length).map(hex => '#' + hex),
        borderWidth: 1,
        hoverBorderWidth: 2
      }],
      options: {
        maintainAspectRatio: false,
        cutoutPercentage: 85,
      }
    } : this.activityCategoryChartData = null;
  }

  buildChartStatus(dataChart) {
    dataChart ? this.activityStatusChartData = {
      labels: dataChart.labels,
      datasets: [{
        data: dataChart.data,
        backgroundColor: palette('cb-Set2', dataChart.data.length).map(hex => '#' + hex),
        borderColor: palette('cb-Set2', dataChart.data.length).map(hex => '#' + hex),
      }],
      options: {
        maintainAspectRatio: false
      }
    } : this.activityStatusChartData = null;
  }

  deleteActivity() {
    this._messageService.clear();
    this._activityService.deleteActivity(this.activity.uid)
      .then(() => {
        this._notify.update('success', 'Atividade deletada com sucesso!');
        this._router.navigate(['/dashboard']);
      });
  }
}
