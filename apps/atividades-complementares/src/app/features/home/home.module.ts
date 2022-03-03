import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { StudentViewComponent } from './student-view/student-view.component';
import { ControllerViewComponent } from './controller-view/controller-view.component';
import { InstitutionViewComponent } from './institution-view/institution-view.component';

@NgModule({
  imports: [
    HomeRoutingModule,
    SharedModule
  ],
  declarations: [
    HomeComponent,
    StudentViewComponent,
    ControllerViewComponent,
    InstitutionViewComponent
  ]
})
export class HomeModule { }
