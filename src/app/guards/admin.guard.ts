import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotifyService } from 'app/services/notify.service';

import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _auth: AuthService, private notify: NotifyService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._auth.user$.pipe(
      take(1),
      map(user => user && user.roles.administrator ? true : false),
      tap(isAdmin => {
        if (!isAdmin) {
          this.notify.update('warning', 'Acesso somente a administradores!');
        }
      })
    );
  }
}
