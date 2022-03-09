import { Component, OnInit } from '@angular/core';

import { EventService } from '../../services/events.service';
import { Post } from './../../models/post.interface';
import { User } from './../../models/user.interface';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'aka-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  posts: Post[];
  user: User;
  loading: boolean;

  constructor(
    private _eventsService: EventService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this._auth.user$.subscribe((user) => (this.user = user));
    this._eventsService.get().subscribe((posts) => {
      this.posts = posts;
      this.loading = false;
    });
  }
}
