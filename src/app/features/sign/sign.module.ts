import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../../shared/shared.module';
import { SignComponent } from './sign.component';
import { SignInComponent } from './signin/sign-in.component';
import { SignUpComponent } from './signup/sign-up.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  declarations: [SignComponent, SignInComponent, SignUpComponent],
  exports: [SignUpComponent]
})
export class SignModule { }
