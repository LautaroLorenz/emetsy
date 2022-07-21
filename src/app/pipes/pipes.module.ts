import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotStringAsObjectPipe } from './dot-string-as-object.pipe';
import { ExecutionStatusPipe } from './execution-status.pipe';

const Pipes = [
  DotStringAsObjectPipe,
  ExecutionStatusPipe,
];

@NgModule({
  declarations: [Pipes],
  imports: [CommonModule],
  exports: [Pipes],
})
export class PipesModule { }