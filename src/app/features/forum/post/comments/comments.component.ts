import { Component, Input, OnInit } from '@angular/core';

import { Comment } from './../../../../models/comment.interface';
import { AuthService } from './../../../../services/auth.service';
import { ForumService } from './../../../../services/forum.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'aka-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() comments: Comment[];
  @Input() postUid: string;
  newComment: string;

  constructor(private _forumService: ForumService, private _authService: AuthService) { }

  ngOnInit() {
  }

  async addComment() {
    const user = await this._authService.user$.pipe(take(1)).toPromise();
    this._forumService.addComment(this.postUid, { description: this.newComment, createdAt: new Date, user: user.uid });
    this.newComment = '';
  }

}
