import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from './../../guards/can-deactivate.guard';
import { InputActivityComponent } from './input-activity/input-activity.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'input-activity',
        component: InputActivityComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'input-activity/:id',
        component: InputActivityComponent,
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
