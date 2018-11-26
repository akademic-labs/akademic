import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';
import { ForumFormComponent } from './forum-form/forum-form.component';

@NgModule({
  imports: [
    CommonModule,
    ForumRoutingModule
  ],
  declarations: [
    ForumComponent,
    ForumFormComponent
  ]
})
export class ForumModule { }
