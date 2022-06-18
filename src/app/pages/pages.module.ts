import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';
import { AvailableTestComponent } from './available-test/available-test.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { UsersComponent } from './users/users.component';
import { HistoryAndReportsComponent } from './history-and-reports/history-and-reports.component';
import { MetersComponent } from './meters/meters.component';
import { BrandsComponent } from './brands/brands.component';


@NgModule({
  declarations: [
    AvailableTestComponent,
    ImportComponent,
    ExportComponent,
    UsersComponent,
    HistoryAndReportsComponent,
    MetersComponent,
    BrandsComponent,
  ],
  imports: [CommonModule, ComponentsModule],
  exports: []
})
export class PagesModule { }
