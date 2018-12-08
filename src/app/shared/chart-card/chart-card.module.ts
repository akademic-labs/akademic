import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartModule } from 'primeng/chart';

import { ChartCardComponent } from './chart-card.component';

@NgModule({
  imports: [
    CommonModule,
    ChartModule
  ],
  declarations: [
    ChartCardComponent
  ],
  exports: [
    ChartCardComponent
  ]
})
export class ChartCardModule { }
