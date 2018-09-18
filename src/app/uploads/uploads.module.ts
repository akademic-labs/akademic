import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { DropZoneDirective } from './drop-zone.directive';
import { FileSizePipe } from './file-size.pipe';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    ToastModule
  ],
  declarations: [UploadPageComponent, DropZoneDirective, FileSizePipe],
  exports: [UploadPageComponent]
})
export class UploadsModule { }
