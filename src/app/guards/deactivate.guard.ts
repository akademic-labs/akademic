import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { FormCanDeactivate } from './deactivate.interface';

@Injectable({ providedIn: 'root' })
export class DeactivateGuard implements CanDeactivate<FormCanDeactivate> {

    canDeactivate(
        component: FormCanDeactivate,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        component.checkForm();

        component.canDeactivateDialog();

        return component.canDeactivateFinal();

    }
}
