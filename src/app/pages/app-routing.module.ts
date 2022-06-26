import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageUrlName } from '../models';
import { AvailableTestComponent } from './available-test/available-test.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { UsersComponent } from './users/users.component';
import { HistoryAndReportsComponent } from './history-and-reports/history-and-reports.component';
import { MetersComponent } from './meters/meters.component';
import { BrandsComponent } from './brands/brands.component';
import { EssayTemplateBuilderComponent } from './essay-template-builder/essay-template-builder.component';
import { ExecuteEssayComponent } from './execute-essay/execute-essay.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: PageUrlName.availableTest,
    pathMatch: 'full'
  },
  {
    path: PageUrlName.availableTest,
    component: AvailableTestComponent
  },
  {
    path: PageUrlName.historyAndReports,
    component: HistoryAndReportsComponent
  },
  {
    path: PageUrlName.meters,
    component: MetersComponent
  },
  {
    path: PageUrlName.brands,
    component: BrandsComponent
  },
  {
    path: PageUrlName.users,
    component: UsersComponent
  },
  {
    path: PageUrlName.import,
    component: ImportComponent
  },
  {
    path: PageUrlName.export,
    component: ExportComponent
  },
  {
    path: PageUrlName.newEssayTemplate,
    component: EssayTemplateBuilderComponent
  },
  {
    path: PageUrlName.editEssayTemplate,
    component: EssayTemplateBuilderComponent
  },
  {
    path: PageUrlName.executeEssay,
    component: ExecuteEssayComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
