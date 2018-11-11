import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { SafePipe } from '../pipes/safe.pipe';
import { FileSizePipe } from './../pipes/file-size.pipe';
import { ConfirmationComponent } from './confirmation/confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    TooltipModule,
  ],
  declarations: [
    ConfirmationComponent,
    SafePipe,
    FileSizePipe
  ],
  exports: [
    ConfirmationComponent,
    SafePipe,
    FileSizePipe,
    ToastModule,
    DialogModule,
    TooltipModule,
  ]
})
export class SharedModule { }
