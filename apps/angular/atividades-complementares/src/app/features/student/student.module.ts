import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { InputActivityComponent } from './input-activity/input-activity.component';
import { StudentRoutingModule } from './student-routing.module';

@NgModule({
  imports: [StudentRoutingModule, SharedModule],
  declarations: [InputActivityComponent],
})
export class StudentModule {}
