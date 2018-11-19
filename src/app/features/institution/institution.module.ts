import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { SignModule } from './../sign/sign.module';
import { ControllersComponent } from './controllers/controllers.component';
import { CoursesComponent } from './courses/courses.component';
import { InstitutionRoutingModule } from './institution-routing.module';

@NgModule({
  imports: [
    InstitutionRoutingModule,
    SharedModule,
    SignModule
  ],
  declarations: [
    ControllersComponent,
    CoursesComponent
  ]
})
export class InstitutionModule { }
