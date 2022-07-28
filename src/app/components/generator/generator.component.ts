import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneratorStatus, GeneratorStatusEnum, WorkingParamsStatus, WorkingParamsStatusEnum } from 'src/app/models';
import { GeneratorService } from 'src/app/services/generator.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneratorComponent {

  readonly WorkingParamsStatusEnum = WorkingParamsStatusEnum;
  readonly GeneratorStatusEnum = GeneratorStatusEnum;

  get workingParamsStatus$(): Observable<WorkingParamsStatus> {
    return this.generatorService.workingParamsStatus$;
  }

  get generatorStatus$(): Observable<GeneratorStatus> {
    return this.generatorService.generatorStatus$;
  }

  get errorCode$(): Observable<number | null> {
    return this.generatorService.errorCode$;    
  }

  constructor(
    private readonly generatorService: GeneratorService,
  ) { }

}
