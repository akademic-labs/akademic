import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';

import { ConfirmationComponent } from './confirmation.component';

@NgModule({
  imports: [CommonModule, ToastModule],
  declarations: [ConfirmationComponent],
  exports: [ConfirmationComponent],
})
export class ConfirmationModule {}
