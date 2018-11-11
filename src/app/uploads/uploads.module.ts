import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DropZoneDirective } from './drop-zone.directive';
import { UploadPageComponent } from './upload-page/upload-page.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    UploadPageComponent,
    DropZoneDirective
  ],
  exports: [UploadPageComponent]
})
export class UploadsModule { }
