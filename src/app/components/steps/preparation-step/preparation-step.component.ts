import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionComponentEnum, StepComponentClass, StepStateEnum } from 'src/app/models';

@Component({
  selector: 'app-preparation-step',
  templateUrl: './preparation-step.component.html',
  styleUrls: ['./preparation-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreparationStepComponent extends StepComponentClass implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.actions = [{
      actionEnum: ActionComponentEnum.StandIdentification,
      workInStepStates: [StepStateEnum.BUILDER, StepStateEnum.EXECUTION],
      actionRawData: (this.actionsRawData && this.actionsRawData[0]) ?? {},
    }, {
      actionEnum: ActionComponentEnum.MeterIdentification,
      workInStepStates: [StepStateEnum.EXECUTION],
      actionRawData: (this.actionsRawData && this.actionsRawData[1]) ?? {},
    },];

    this.stepState = this.buildState(this.stepStateEnum);
  }
}
