import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    ToastModule
  ],
  declarations: [
    ConfirmationComponent
  ],
  exports: [
    ConfirmationComponent,
    ToastModule
  ]
})
export class SharedModule { }
