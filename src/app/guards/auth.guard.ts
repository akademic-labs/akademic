import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

import { take, map } from 'rxjs/operators'

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _route: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this._authService.isLoggedIn.pipe(
      take(1),
      map((isLogged: boolean) => {
        if (!isLogged) {
          this._route.navigate(['/dashboard']);
          return false;
        }
        return true;
      }));
  }
}
