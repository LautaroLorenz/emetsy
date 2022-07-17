import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionComponentEnum, StepComponentClass, StepStateEnum } from 'src/app/models';

@Component({
  selector: 'app-contrast-test-step',
  templateUrl: './contrast-test-step.component.html',
  styleUrls: ['./contrast-test-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContrastTestStepComponent extends StepComponentClass implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.actions = [{
      actionEnum: ActionComponentEnum.EnterTestValues,
      workInStepStates: [StepStateEnum.BUILDER, StepStateEnum.EXECUTION],
      actionRawData: (this.actionsRawData && this.actionsRawData[0]) ?? {},
      actionOptionalParams: {
        testName: 'Prueba de contraste'
      }
    }];

    this.stepState = this.buildState(this.stepStateEnum);
  }
}
