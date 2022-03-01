import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '../../pipes/pipes.module';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { ConfirmationModule } from '../confirmation/confirmation.module';
import { DirectivesModule } from './../../directives/directives.module';
import { UploadsPageComponent } from './uplodas-page/uploads-page.component';

@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    ToastModule,
    PipesModule,
    DirectivesModule,
    ConfirmationModule,
  ],
  declarations: [UploadsPageComponent],
  exports: [UploadsPageComponent],
})
export class UploadsModule {}
