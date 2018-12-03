import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { FormComponent } from './form/form.component';
import { CommentsComponent } from './post/comments/comments.component';
import { PostComponent } from './post/post.component';

@NgModule({
  imports: [
    EventsRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    EventsComponent,
    PostComponent,
    FormComponent,
    CommentsComponent
  ]
})
export class EventsModule { }
