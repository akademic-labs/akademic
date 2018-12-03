import { Component, Input, OnInit } from '@angular/core';

import { Post } from './../../../models/post.interface';
import { EventService } from '../../../services/events.service';

@Component({
  selector: 'aka-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  constructor(private _eventService: EventService) { }

  ngOnInit() {
  }

  vote(isUp: boolean) {
    if (isUp) {
      this.post.votes++;
      this._eventService.vote(this.post);
    } else {
      this.post.votes--;
      this._eventService.vote(this.post);
    }
  }
}
