import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AvailableTestComponent } from './available-test/available-test.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { UsersComponent } from './users/users.component';
import { HistoryAndReportsComponent } from './history-and-reports/history-and-reports.component';
import { MetersComponent } from './meters/meters.component';
import { BrandsComponent } from './brands/brands.component';
import { EssayTemplateBuilderComponent } from './essay-template-builder/essay-template-builder.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ensayos-disponibles',
    pathMatch: 'full'
  },
  {
    path: 'ensayos-disponibles',
    component: AvailableTestComponent
  },
  {
    path: 'historial-y-reportes',
    component: HistoryAndReportsComponent
  },
  {
    path: 'medidores',
    component: MetersComponent
  },
  {
    path: 'marcas',
    component: BrandsComponent
  },
  {
    path: 'usuarios',
    component: UsersComponent
  },
  {
    path: 'importar',
    component: ImportComponent
  },
  {
    path: 'exportar',
    component: ExportComponent
  },
  {
    path: 'nuevo-template-ensayo',
    component: EssayTemplateBuilderComponent
  },
  {
    path: 'editar-template-ensayo/:id',
    component: EssayTemplateBuilderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
