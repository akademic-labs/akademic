import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PickListModule } from 'primeng/picklist';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { DirectivesModule } from './../directives/directives.module';
import { PipesModule } from './../pipes/pipes.module';
import { ChartCardModule } from './chart-card/chart-card.module';
import { ConfirmationModule } from './confirmation/confirmation.module';
import { MessageControlErrorComponent } from './message-control-error/message-control-error.component';
import { UploadsModule } from './uploads-page/uploads.module';

@NgModule({
    imports: [
        CommonModule,
        // PrimeNG
        ToastModule,
        TooltipModule,
        TableModule,
        DropdownModule,
        ConfirmDialogModule,
        // Pipes
        PipesModule,
        // Directives
        DirectivesModule
    ],
    declarations: [
        MessageControlErrorComponent
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        // Components
        ConfirmationModule,
        MessageControlErrorComponent,
        ChartCardModule,
        UploadsModule,
        // PrimeNG
        ToastModule,
        TooltipModule,
        TableModule,
        DropdownModule,
        PickListModule,
        // Pipes
        PipesModule,
        // Directives
        DirectivesModule
    ],
    providers: [ConfirmationService]
})
export class SharedModule { }
