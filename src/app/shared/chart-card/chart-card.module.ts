
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ChartModule} from 'primeng/chart';

import { ChartCardComponent } from './chart-card/chart-card.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
