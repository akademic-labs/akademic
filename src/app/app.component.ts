import { Component, OnInit } from '@angular/core';

import { User } from './models/user.interface';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'aka-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  user: User;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe((user) => (this.user = user));
  }
}
