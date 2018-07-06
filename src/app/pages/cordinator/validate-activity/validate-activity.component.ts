import { ActivityService } from 'app/services/activity.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Activity } from 'app/models/activity.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aka-validate-activity',
  templateUrl: './validate-activity.component.html',
  styleUrls: ['./validate-activity.component.css']
})
export class ValidateActivityComponent implements OnInit, OnDestroy {
  activity: Activity;
  uidActivity: string;
  inscricao: Subscription;

  constructor(private _route: ActivatedRoute, private _actService: ActivityService) { }

  ngOnInit() {
    this.inscricao = this._route.paramMap.subscribe(params => {
      this.uidActivity = params.get('id');
      this._actService.getActivityById(this.uidActivity)
        .subscribe(response => this.activity = response);
    });
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

  toApprove() {
    this.activity.status = 'F';
    this._actService.updateActivity(this.uidActivity, this.activity);
  }

  toReprove() {
    this.activity.status = 'R';
    this._actService.updateActivity(this.uidActivity, this.activity);
  }

}
