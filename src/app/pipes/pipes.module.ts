import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotStringAsObjectPipe } from './dot-string-as-object.pipe';

const Pipes = [
  DotStringAsObjectPipe
];

@NgModule({
  declarations: [Pipes],
  imports: [CommonModule],
  exports: [Pipes],
})
export class PipesModule { }