import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionComponentEnum, StepComponentClass, StepStateEnum } from 'src/app/models';

@Component({
  selector: 'app-photocell-adjustment-step',
  templateUrl: './photocell-adjustment-step.component.html',
  styleUrls: ['./photocell-adjustment-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentStepComponent extends StepComponentClass implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.actions = [{
      actionEnum: ActionComponentEnum.PhotocellAdjustmentValues,
      workInStepStates: [StepStateEnum.BUILDER, StepStateEnum.EXECUTION],
      actionRawData: (this.actionsRawData && this.actionsRawData[0]) ?? {},
    }];

    this.stepState = this.buildState(this.stepStateEnum);
  }
}
