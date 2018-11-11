import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InputActivityComponent } from './input-activity/input-activity.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'input-activity', component: InputActivityComponent },
      { path: 'input-activity/:id', component: InputActivityComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
