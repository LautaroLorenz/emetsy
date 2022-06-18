import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { MenuComponent } from './menu/menu.component';
import { AbmComponent } from './abm/abm.component';
import { MatIconModule } from '@angular/material/icon';

const PrimeNgModules = [
  MenubarModule
];

const EmetsyComponents = [
  MenuComponent,
  AbmComponent
]

const MaterialModules = [
  MatIconModule
]
@NgModule({
  declarations: [EmetsyComponents],
  imports: [CommonModule, PrimeNgModules, MaterialModules],
  exports: [EmetsyComponents, PrimeNgModules, MaterialModules]
})
export class ComponentsModule { }
