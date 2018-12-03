import { Component, OnInit } from '@angular/core';

import { Post } from './../../models/post.interface';
import { User } from './../../models/user.interface';
import { AuthService } from './../../services/auth.service';
import { EventService } from '../../services/events.service';

@Component({
  selector: 'aka-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  posts: Post[];
  user: User;

  constructor(private _eventsService: EventService, private _auth: AuthService) { }

  ngOnInit() {
    this._auth.user$.subscribe(user => this.user = user);
    this._eventsService.get().subscribe(posts => {
      this.posts = posts;
    })
  }
}
