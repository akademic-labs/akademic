import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotifyService } from 'app/services/notify.service';

import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

  constructor(private _auth: AuthService, private router: Router, private notify: NotifyService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this._auth.user$.pipe(
      take(1),
      map(user => {
        if (!!user) {
          this.router.navigate(['./dashboard']);
          return false;
        }

        return true;
      })
    );
  }
}
