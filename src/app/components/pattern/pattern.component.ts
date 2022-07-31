import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PatternParams, PatternStatus, PatternStatusEnum, WorkingParamsStatus, WorkingParamsStatusEnum } from 'src/app/models';
import { PatternService } from 'src/app/services/pattern.service';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatternComponent {

  readonly WorkingParamsStatusEnum = WorkingParamsStatusEnum;
  readonly PatternStatusEnum = PatternStatusEnum;

  get workingParamsStatus$(): Observable<WorkingParamsStatus> {
    return this.patternService.workingParamsStatus$;
  }

  get patternStatus$(): Observable<PatternStatus> {
    return this.patternService.patternStatus$;
  }

  get errorCode$(): Observable<number | null> {
    return this.patternService.errorCode$;
  }
  get params$(): Observable<PatternParams | null> {
    return this.patternService.params$;
  }

  constructor(
    private readonly patternService: PatternService,
  ) { }

}
