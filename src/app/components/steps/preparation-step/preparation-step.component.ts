import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActionComponentEnum, StepComponentClass, StepStateEnum } from 'src/app/models';

@Component({
  selector: 'app-preparation-step',
  templateUrl: './preparation-step.component.html',
  styleUrls: ['./preparation-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreparationStepComponent extends StepComponentClass implements OnInit {

  @Input() override stepStateEnum!: StepStateEnum;

  constructor() {
    super();

    this.actions = [{
      actionEnum: ActionComponentEnum.StandIdentification,
      workInStepStates: [StepStateEnum.BUILDER, StepStateEnum.EXECUTION],
    }, {
      actionEnum: ActionComponentEnum.MeterIdentification,
      workInStepStates: [StepStateEnum.EXECUTION],
    },]
  }

  ngOnInit(): void {
    this.stepState = this.buildState(this.stepStateEnum);
  }

}
