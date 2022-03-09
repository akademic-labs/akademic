import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActivityResolve } from './../../resolvers/activity.resolver';
import { ActivityTypeComponent } from './activity-type/activity-type.component';
import { RulesComponent } from './rules/rules.component';
import { ValidateActivityComponent } from './validate-activity/validate-activity.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'activity-types', component: ActivityTypeComponent },
      {
        path: 'validate-activity/:id',
        component: ValidateActivityComponent,
        resolve: { activity: ActivityResolve },
      },
      { path: 'rules', component: RulesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControllerRoutingModule {}
