import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './../services/auth.service';
import { NotifyService } from './../services/notify.service';
import { RolesService } from './../services/roles.service';

@Injectable({
  providedIn: 'root'
})
export class InstitutionGuard implements CanActivate {
  constructor(private _auth: AuthService, private notify: NotifyService, private _rolesService: RolesService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._auth.user$.pipe(
      take(1),
      map(user => user && this._rolesService.isInstitution(user) ? true : false),
      tap(isInstitution => {
        if (!isInstitution) {
          this.notify.update('warning', 'Acesso somente a estudantes!');
        }
      })
    );
  }
}
