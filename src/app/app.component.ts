import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from 'app/models/user.interface';

@Component({
  selector: 'aka-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(public _auth: AuthService) { }

  ngOnInit() {
    this._auth.user$.subscribe(user => this.user = user);
  }
}
