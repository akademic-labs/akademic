import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [ProfileRoutingModule, SharedModule],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
