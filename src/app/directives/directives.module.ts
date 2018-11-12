import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropZoneDirective } from './drop-zone.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DropZoneDirective],
  exports: [DropZoneDirective]
})
export class DirectivesModule { }
