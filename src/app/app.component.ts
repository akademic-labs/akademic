import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { User } from './models/user.interface';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'aka-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(public _auth: AuthService) { }

  async ngOnInit() {
    this.user = await this._auth.user$.pipe(take(1)).toPromise();
  }
}
