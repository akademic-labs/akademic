import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private _router: Router) { }

  login() {
    localStorage.setItem('user_token', JSON.stringify({ username: 'teste', token: 'teste' }));
    this.loggedIn.next(true);
    this._router.navigate(['/dashboard']);
  }

  get isLoggedIn() {
      return this.loggedIn.asObservable();
  }

  logOut() {
    this.loggedIn.next(false);
    this._router.navigate(['./']);
  }
}
