import { Pipe, PipeTransform } from '@angular/core';
import { pick } from 'dot-object';
import { ExecutionStatus } from '../models';

@Pipe({
  name: 'executionStatus'
})
export class ExecutionStatusPipe implements PipeTransform {


  transform(value: ExecutionStatus | null): any {
    switch(value) {
      case 'CREATED': return 'Creada';
      case 'PENDING': return 'Pendiente';
      case 'IN_PROGRESS': return 'En progreso';
      case 'COMPLETED': return 'Completada';
    }

    return '';
  }

}
