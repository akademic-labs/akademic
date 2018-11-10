import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ControllerRoutingModule } from './controller-routing.module';
import { RulesComponent } from './rules/rules.component';
import { ValidateActivityComponent } from './validate-activity/validate-activity.component';

@NgModule({
  imports: [
    ControllerRoutingModule,
    SharedModule
  ],
  declarations: [
    ValidateActivityComponent,
    RulesComponent
  ]
})
export class ControllerModule { }
