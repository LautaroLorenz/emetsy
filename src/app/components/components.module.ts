import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenubarModule } from 'primeng/menubar';
import { MenuComponent } from './menu/menu.component';

const PrimeNgModules = [
  MenubarModule
];

const EmetsyComponents = [
  MenuComponent
]

@NgModule({
  declarations: [EmetsyComponents],
  imports: [CommonModule, PrimeNgModules],
  exports: [PrimeNgModules, EmetsyComponents]
})
export class ComponentsModule { }
