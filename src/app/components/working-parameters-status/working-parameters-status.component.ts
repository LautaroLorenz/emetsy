import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WorkingParamsStatus, WorkingParamsStatusEnum } from 'src/app/models';

@Component({
  selector: 'app-working-parameters-status',
  templateUrl: './working-parameters-status.component.html',
  styleUrls: ['./working-parameters-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkingParametersStatusComponent {

  @Input() workingParamsStatus!: WorkingParamsStatus;
  readonly WorkingParamsStatusEnum = WorkingParamsStatusEnum;

  constructor() { }

}
