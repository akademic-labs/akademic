import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from '../pipes/safe.pipe';
import { ToastModule } from 'primeng/toast';

import { ConfirmationComponent } from './confirmation/confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    ToastModule
  ],
  declarations: [
    ConfirmationComponent,
    SafePipe
  ],
  exports: [
    ConfirmationComponent,
    ToastModule,
    SafePipe
  ]
})
export class SharedModule { }
