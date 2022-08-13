import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceErrorCode'
})
export class DeviceErrorCode implements PipeTransform {


  transform(value: number): any {
    switch(value) {
      case 1: return 'Fallo de temperatura';      
      case 2: return 'Fallo en un componente';      
      case 3: return 'Fallo sobre carga de tensión';      
      case 4: return 'Fallo sobre carga de corriente';      
      case 5: return 'Fallo en la fase L1';      
      case 6: return 'Fallo en la fase L2';      
      case 7: return 'Fallo en la fase L3';      
      case 8: return 'Fallo por protección de entrada';      
      case 9: return 'Fallo por protección de salida';      
    }
    return '';
  }

}
