import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PhotocellAdjustmentValuesAction, StepComponentClass } from 'src/app/models';


@Component({
  selector: 'app-photocell-adjustment-step',
  templateUrl: './photocell-adjustment-step.component.html',
  styleUrls: ['./photocell-adjustment-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentStepComponent extends StepComponentClass implements OnInit, OnDestroy {

  constructor() {
    super();

    this.actions = [
      new PhotocellAdjustmentValuesAction(),
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
