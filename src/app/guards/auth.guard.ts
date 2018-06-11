import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { NotifyService } from 'app/services/notify.service';

import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private router: Router, private notify: NotifyService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this._auth.user.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.notify.update('warning', 'Você precisa estar logado!');
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
