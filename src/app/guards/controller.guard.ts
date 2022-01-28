import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotifyService } from '../services/notify.service';

import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { RolesService } from '../services/roles.service';

@Injectable({
  providedIn: 'root',
})
export class ControllerGuard implements CanActivate {
  constructor(
    private _auth: AuthService,
    private notify: NotifyService,
    private _rolesService: RolesService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._auth.user$.pipe(
      take(1),
      map((user) =>
        user && this._rolesService.isController(user) ? true : false
      ),
      tap((isController) => {
        if (!isController) {
          this.notify.update('warning', 'Acesso somente a coordenadores!');
        }
      })
    );
  }
}
