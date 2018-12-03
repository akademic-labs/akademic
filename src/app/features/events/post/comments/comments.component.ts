import { Component, Input, OnInit } from '@angular/core';

import { Comment } from './../../../../models/comment.interface';
import { AuthService } from './../../../../services/auth.service';
import { EventService } from '../../../../services/events.service';
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

  constructor(private _eventService: EventService, private _authService: AuthService) { }

  ngOnInit() {
  }

  async addComment() {
    const user = await this._authService.user$.pipe(take(1)).toPromise();
    this._eventService.addComment(this.postUid, { description: this.newComment, createdAt: new Date, user: user.uid });
    this.newComment = '';
  }

}
