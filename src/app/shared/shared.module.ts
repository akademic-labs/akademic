import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { LightboxModule } from 'primeng/lightbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { SafePipe } from '../pipes/safe.pipe';
import { ChartCardModule } from './chart-card/chart-card.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { MessageControlErrorComponent } from './message-control-error/message-control-error.component';

@NgModule({
  imports: [
    CommonModule,
    ToastModule
  ],
  declarations: [
    ConfirmationComponent,
    MessageControlErrorComponent,
    SafePipe
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmationComponent,
    MessageControlErrorComponent,
    SafePipe,
    ChartCardModule,
    DropdownModule,
    ToastModule,
    TableModule,
    GalleriaModule,
    LightboxModule,
    FileUploadModule,
    DialogModule,
    TooltipModule
  ]
})
export class SharedModule { }
