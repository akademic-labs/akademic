import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ActivityTypeComponent } from './activity-type/activity-type.component';
import { ControllersComponent } from './controllers/controllers.component';
import { InstitutionRoutingModule } from './institution-routing.module';

@NgModule({
  imports: [
    InstitutionRoutingModule,
    SharedModule
  ],
  declarations: [
    ControllersComponent,
    ActivityTypeComponent
  ]
})
export class InstitutionModule { }
