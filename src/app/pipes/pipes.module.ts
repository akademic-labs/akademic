import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileSizePipe } from './file-size.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SafePipe,
    FileSizePipe
  ],
  exports: [
    SafePipe,
    FileSizePipe
  ]
})
export class PipesModule { }
