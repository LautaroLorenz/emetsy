import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CalculatorParams, CalculatorStatus, CalculatorStatusEnum, WorkingParamsStatus, WorkingParamsStatusEnum } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorComponent {

  readonly WorkingParamsStatusEnum = WorkingParamsStatusEnum;
  readonly CalculatorStatusEnum = CalculatorStatusEnum;

  get workingParamsStatus$(): Observable<WorkingParamsStatus> {
    return this.calculatorService.workingParamsStatus$;
  }

  get calculatorStatus$(): Observable<CalculatorStatus> {
    return this.calculatorService.calculatorStatus$;
  }

  get errorCode$(): Observable<number | null> {
    return this.calculatorService.errorCode$;    
  }

  get params$(): Observable<CalculatorParams | null> {
    return this.calculatorService.params$;    
  }

  constructor(
    private readonly calculatorService: CalculatorService,
  ) { }

}
