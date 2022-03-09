import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../shared/shared.module';
import { SignComponent } from './sign.component';
import { SignInComponent } from './signin/sign-in.component';
import { SignUpComponent } from './signup/sign-up.component';
import { SignUpFormComponent } from './signup/sign-up-form/sign-up-form.component';

@NgModule({
  imports: [RouterModule, SharedModule],
  declarations: [
    SignComponent,
    SignInComponent,
    SignUpComponent,
    SignUpFormComponent,
  ],
  exports: [SignUpFormComponent],
})
export class SignModule {}
