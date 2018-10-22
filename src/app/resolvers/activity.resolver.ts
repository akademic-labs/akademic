import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Activity } from '../models/activity.interface';
import { ActivityService } from '../services/activity.service';
import { catchError, take } from 'rxjs/operators';
import { empty } from 'rxjs';

@Injectable()
export class ActivityResolve implements Resolve<Activity> {

  constructor(private _activityService: ActivityService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this._activityService.getActivityById(route.paramMap.get('id')).pipe(
      take(1),
      catchError(() => {
        return empty();
      })
    );
  }
}
