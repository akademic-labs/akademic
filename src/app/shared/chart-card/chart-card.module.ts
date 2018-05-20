
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChartCardComponent } from './chart-card/chart-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [

    ChartCardComponent

  ],
  exports: [
    ChartCardComponent
  ]
})
export class ChartCardModule { }
