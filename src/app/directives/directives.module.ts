import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFocusedDirective } from './input-focused.directive';


const EmetsyDirectives = [
  InputFocusedDirective
]

@NgModule({
  declarations: [EmetsyDirectives],
  imports: [CommonModule],
  exports: [EmetsyDirectives],
  providers: []
})
export class DirectivesModule { }
