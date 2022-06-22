import { Pipe, PipeTransform } from '@angular/core';
import { pick } from 'dot-object';

@Pipe({
  name: 'dotStringAsObject'
})
export class DotStringAsObjectPipe implements PipeTransform {


  transform(value: Object, path: string): any {
    return pick(path, value)
  }

}
