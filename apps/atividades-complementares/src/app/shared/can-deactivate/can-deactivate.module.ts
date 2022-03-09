import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';

import { CanDeactivateComponent } from './can-deactivate.component';

@NgModule({
  imports: [CommonModule, ToastModule],
  declarations: [CanDeactivateComponent],
  exports: [CanDeactivateComponent],
})
export class CanDeactivateModule {}
