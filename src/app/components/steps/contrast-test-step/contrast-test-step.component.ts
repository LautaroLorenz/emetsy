import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { EnterTestValuesAction, StepComponentClass, ContrastTestParametersAction, RunConfigurationAction } from 'src/app/models';

@Component({
  selector: 'app-contrast-test-step',
  templateUrl: './contrast-test-step.component.html',
  styleUrls: ['./contrast-test-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContrastTestStepComponent extends StepComponentClass implements OnInit, OnDestroy {

  constructor() {
    super();

    this.actions = [
      new EnterTestValuesAction('Prueba de constraste', 0),
      new ContrastTestParametersAction(),
      new RunConfigurationAction(0, 3),
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
