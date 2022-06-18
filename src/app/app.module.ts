import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './pages/app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { EnsayosDisponiblesComponent } from './pages/ensayos-disponibles/ensayos-disponibles.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { HistorialYReportesComponent } from './pages/historial-y-reportes/historial-y-reportes.component';
import { MedidoresComponent } from './pages/medidores/medidores.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { ImportarComponent } from './pages/importar/importar.component';
import { ExportarComponent } from './pages/exportar/exportar.component';

@NgModule({
  declarations: [
    AppComponent,
    EnsayosDisponiblesComponent,
    UsuariosComponent,
    HistorialYReportesComponent,
    MedidoresComponent,
    MarcasComponent,
    ImportarComponent,
    ExportarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
