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
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  exports: []
})
export class PagesModule { }
