import { Component, Input, OnInit } from '@angular/core';

import { Post } from './../../../models/post.interface';
import { ForumService } from './../../../services/forum.service';

@Component({
  selector: 'aka-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  constructor(private _forumService: ForumService) { }

  ngOnInit() {
  }

  vote(isUp: boolean) {
    if (isUp) {
      this.post.votes++;
      this._forumService.vote(this.post);
    } else {
      this.post.votes--;
      this._forumService.vote(this.post);
    }
  }
}
