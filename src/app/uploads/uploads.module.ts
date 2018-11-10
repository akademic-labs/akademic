import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DropZoneDirective } from './drop-zone.directive';
import { FileSizePipe } from './file-size.pipe';
import { UploadPageComponent } from './upload-page/upload-page.component';

@NgModule({
  imports: [
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
