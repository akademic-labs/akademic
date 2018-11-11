import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoursesComponent } from './courses/courses.component';
import { InstitutionsComponent } from './institutions/institutions.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'courses', component: CoursesComponent },
      { path: 'institutions', component: InstitutionsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
