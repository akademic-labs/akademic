import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ControllersComponent } from './controllers/controllers.component';
import { InstitutionRoutingModule } from './institution-routing.module';
import { CoursesComponent } from './courses/courses.component';

@NgModule({
  imports: [
    InstitutionRoutingModule,
    SharedModule
  ],
  declarations: [
    ControllersComponent,
    CoursesComponent
  ]
})
export class InstitutionModule { }
