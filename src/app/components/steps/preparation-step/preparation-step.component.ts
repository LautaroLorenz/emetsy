import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ExecutionStatus, StandIdentificationAction, StepComponentClass, UserIdentificationAction } from 'src/app/models';

@Component({
  selector: 'app-preparation-step',
  templateUrl: './preparation-step.component.html',
  styleUrls: ['./preparation-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreparationStepComponent extends StepComponentClass implements OnInit, OnDestroy {

  readonly userIdentificationAction = new UserIdentificationAction();
  readonly standIdentificationAction = new StandIdentificationAction(this.destroyed$);

  constructor() {
    super();

    this.actions = [
      this.userIdentificationAction,
      this.standIdentificationAction,
    ];
  }

  ngOnInit(): void {
    this.buildStepForm(this.actions);

    if (this.isBuildMode) {
      this.userIdentificationAction.executionStatus$.next('COMPLETED');
    } else {
      this.standIdentificationAction.executionStatus$.next('COMPLETED');
    }
    const includedStatus: ExecutionStatus[] = this.isBuildMode ? ['PENDING'] : ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    this.actionsToRender = this.filterActionsByExecutionStatus(this.actions, includedStatus);

    this.form.patchValue(this.actionsRawData);
    this.formValueChanges().subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
