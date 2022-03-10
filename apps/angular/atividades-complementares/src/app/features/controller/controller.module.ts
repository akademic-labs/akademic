import { NgModule } from '@angular/core';

import { ActivityResolve } from './../../resolvers/activity.resolver';
import { SharedModule } from './../../shared/shared.module';
import { ActivityTypeComponent } from './activity-type/activity-type.component';
import { ControllerRoutingModule } from './controller-routing.module';
import { RulesComponent } from './rules/rules.component';
import { ValidateActivityComponent } from './validate-activity/validate-activity.component';

@NgModule({
  imports: [ControllerRoutingModule, SharedModule],
  declarations: [
    ValidateActivityComponent,
    ActivityTypeComponent,
    RulesComponent,
  ],
  providers: [ActivityResolve],
})
export class ControllerModule {}
