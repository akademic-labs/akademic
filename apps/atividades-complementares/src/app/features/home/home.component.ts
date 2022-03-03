import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { User } from '../../models/user.interface';
import { AuthService } from './../../services/auth.service';
import { RolesService } from './../../services/roles.service';

@Component({
  selector: 'aka-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(private _auth: AuthService, public _rolesService: RolesService) { }

  ngOnInit() {
    this._auth.user$.pipe(take(1)).subscribe(res => {
      this.user = res;
    });
  }
}
