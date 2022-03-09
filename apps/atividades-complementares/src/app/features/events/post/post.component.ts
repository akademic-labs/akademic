import { Component, Input } from '@angular/core';

import { Post } from './../../../models/post.interface';

@Component({
  selector: 'aka-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  @Input() post: Post;
}
