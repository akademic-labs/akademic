import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControllersComponent } from './controllers/controllers.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'courses', component: CoursesComponent },
      { path: 'controllers', component: ControllersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitutionRoutingModule { }
