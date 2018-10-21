import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { DropZoneDirective } from './drop-zone.directive';
import { FileSizePipe } from './file-size.pipe';

import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    TooltipModule
  ],
  declarations: [
    UploadPageComponent,
    DropZoneDirective,
    FileSizePipe
  ],
  exports: [UploadPageComponent]
})
export class UploadsModule { }
