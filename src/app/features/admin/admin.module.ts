import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { CoursesComponent } from './courses/courses.component';
import { InstitutionsComponent } from './institutions/institutions.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    InstitutionsComponent,
    CoursesComponent
  ]
})
export class AdminModule { }
