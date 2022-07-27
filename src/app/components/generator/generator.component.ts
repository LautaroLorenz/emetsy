import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DevicePostStatus, DeviceStatus } from 'src/app/models';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorComponent {

  get generatorPostStatus$(): Observable<DevicePostStatus> {
    return this.generatorService.devicePostStatus$;
  }  
  get generatorStatus$(): Observable<DeviceStatus> {
    return this.generatorService.deviceStatus$;
  }  
  get generatorErrorCode$(): Observable<number | null> {
    return this.generatorService.errorCode$;
  }

  constructor(
    private readonly generatorService: GeneratorService,
  ) { }

}
