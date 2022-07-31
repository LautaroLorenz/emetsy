import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkingParamsStatus, WorkingParamsStatusEnum } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorComponent {

  readonly WorkingParamsStatusEnum = WorkingParamsStatusEnum;
  // readonly PatternStatusEnum = CalculatorStatusEnum;

  get workingParamsStatus$(): Observable<WorkingParamsStatus> {
    return this.calculatorService.workingParamsStatus$;
  }

  // get patternStatus$(): Observable<PatternStatus> {
  //   return this.patternService.patternStatus$;
  // }

  // get errorCode$(): Observable<number | null> {
  //   return this.patternService.errorCode$;    
  // }
  // get params$(): Observable<Phases | null> {
  //   return this.patternService.params$;    
  // }

  constructor(
    private readonly calculatorService: CalculatorService,
  ) { }

}
