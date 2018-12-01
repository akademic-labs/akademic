import { Component, OnInit } from '@angular/core';

import { Post } from './../../models/post.interface';
import { User } from './../../models/user.interface';
import { AuthService } from './../../services/auth.service';
import { ForumService } from './../../services/forum.service';

@Component({
  selector: 'aka-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {
  posts: Post[];
  user: User;

  constructor(private _forumService: ForumService, private _auth: AuthService) { }

  ngOnInit() {
    this._auth.user$.subscribe(user => this.user = user);
    // TODO: get the comments subcolletcion too
    this._forumService.get().subscribe(posts => {
      this.posts = posts;
      console.log(this.posts);
    })
  }
}
