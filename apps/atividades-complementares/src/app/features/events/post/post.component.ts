import { Component, Input, OnInit } from '@angular/core';

import { Post } from './../../../models/post.interface';

@Component({
  selector: 'aka-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  constructor() {}

  ngOnInit() {}
}
