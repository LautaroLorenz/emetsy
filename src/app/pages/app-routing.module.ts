import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnsayosDisponiblesComponent } from './ensayos-disponibles/ensayos-disponibles.component';
import { ExportarComponent } from './exportar/exportar.component';
import { HistorialYReportesComponent } from './historial-y-reportes/historial-y-reportes.component';
import { ImportarComponent } from './importar/importar.component';
import { MarcasComponent } from './marcas/marcas.component';
import { MedidoresComponent } from './medidores/medidores.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'ensayos-disponibles',
    pathMatch: 'prefix'
  },
  {
    path: 'ensayos-disponibles',
    component: EnsayosDisponiblesComponent
  },
  {
    path: 'historial-y-reportes',
    component: HistorialYReportesComponent
  },
  {
    path: 'medidores',
    component: MedidoresComponent
  },
  {
    path: 'marcas',
    component: MarcasComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'importar',
    component: ImportarComponent
  },
  {
    path: 'exportar',
    component: ExportarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
