import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { CanDeactivateComponent } from './../shared/can-deactivate/can-deactivate.component';

export interface CanDeactivateInterface {
  wasChanged: Subject<boolean>;
  withoutChanged: boolean;
  check();
  choose(choice: boolean);
}

@Injectable({ providedIn: 'root' })
export class CanDeactivateGuard
  implements CanDeactivate<CanDeactivateComponent>
{
  canDeactivate(
    component: CanDeactivateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    component.check();
    // return component.wasChanged;
    return component.withoutChanged || component.wasChanged;
  }
}
