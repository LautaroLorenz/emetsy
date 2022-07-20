import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { StandIdentificationAction, StepComponentClass } from 'src/app/models';

@Component({
  selector: 'app-preparation-step',
  templateUrl: './preparation-step.component.html',
  styleUrls: ['./preparation-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreparationStepComponent extends StepComponentClass implements OnInit, OnDestroy {

  constructor() {
    super();

    this.actions = [
      new StandIdentificationAction(this.destroyed$),
    ];
  }

  ngOnInit(): void {
    this.buildStepForm(this.actions);
    this.form.patchValue(this.actionsRawData);
    this.formValueChanges().subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
