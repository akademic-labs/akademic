import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';
import { PostComponent } from './post/post.component';
import { FormComponent } from './form/form.component';
import { CommentsComponent } from './post/comments/comments.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    ForumRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    ForumComponent,
    PostComponent,
    FormComponent,
    CommentsComponent
  ]
})
export class ForumModule { }
