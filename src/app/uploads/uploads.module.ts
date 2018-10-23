import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from '../shared/shared.module';
import { DropZoneDirective } from './drop-zone.directive';
import { FileSizePipe } from './file-size.pipe';
import { UploadPageComponent } from './upload-page/upload-page.component';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    TooltipModule,
    SharedModule
  ],
  declarations: [
    UploadPageComponent,
    DropZoneDirective,
    FileSizePipe
  ],
  exports: [UploadPageComponent]
})
export class UploadsModule { }
