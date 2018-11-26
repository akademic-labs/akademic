import { Component, OnInit } from '@angular/core';

import { Post } from './../../models/post.interface';

@Component({
  selector: 'aka-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  posts: Post[];

  constructor() { }

  ngOnInit() {
    this.posts = [{
      title: 'Titulo qualquer',
      description: 'Descrição nada a ver só para ocupar espaço e tudo mais',
      address: {
        city: 'Araucária',
        state: 'Paraná',
        country: 'Brasil'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: 10,
      owner: {
        displayName: 'Patrick'
      },
      comments: [
        {
          description: 'Comentário qualquer de exemplo somente para teste e tudo mais ok',
          created: new Date,
          user: {
            displayName: 'Luiz Henrique'
          }
        }
      ]
    }];
  }

  addPost() {

  }

}
