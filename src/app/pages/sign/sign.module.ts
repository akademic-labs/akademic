import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignUpComponent } from './signup/sign-up.component';
import { SignInComponent } from './signin/sign-in.component';
import { SignComponent } from './sign.component';
import { MessageControlErrorModule } from 'app/shared/message-control-error/message-control-error.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MessageControlErrorModule
  ],
  declarations: [SignComponent, SignInComponent, SignUpComponent]
})
export class SignModule { }
