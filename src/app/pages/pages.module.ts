import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivesModule } from '../directives/directives.module';
import { ComponentsModule } from '../components/components.module';
import { AvailableTestComponent } from './available-test/available-test.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { UsersComponent } from './users/users.component';
import { HistoryAndReportsComponent } from './history-and-reports/history-and-reports.component';
import { MetersComponent } from './meters/meters.component';
import { BrandsComponent } from './brands/brands.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EssayTemplateBuilderComponent } from './essay-template-builder/essay-template-builder.component';
import { ExecuteEssayComponent } from './execute-essay/execute-essay.component';
import { PendingChangesGuard } from '../guards/pending-changes.guard';
import { DevicesTurnOffGuard } from '../guards/devices-turn-off.guard';
import { SeeReportComponent } from './see-report/see-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TerminalComponent } from './terminal/terminal.component';


@NgModule({
  declarations: [
    AvailableTestComponent,
    ImportComponent,
    ExportComponent,
    UsersComponent,
    HistoryAndReportsComponent,
    MetersComponent,
    BrandsComponent,
    EssayTemplateBuilderComponent,
    ExecuteEssayComponent,
    SeeReportComponent,
    DashboardComponent,
    TerminalComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  exports: [],
  providers: [
    PendingChangesGuard,
    DevicesTurnOffGuard
  ]
})
export class PagesModule { }
