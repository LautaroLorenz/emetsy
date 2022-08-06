import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, Observable, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ContrastTestStep, PhotocellAdjustmentStep, PreparationStep, ReportBuilder, ReportStep, StepBuilder } from 'src/app/models';
import { EssayTemplateStep } from 'src/app/models/database/tables/essay-template-step.model';

@Component({
  selector: 'app-step-build-form',
  templateUrl: './step-build-form.component.html',
  styleUrls: ['./step-build-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepBuildFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() essayTemplateStep!: EssayTemplateStep;
  @Input() selectedIndex!: number | null;
  @Input() stepId!: number;
  @Input() actionsRawData!: any[];
  @Output() actionsRawDataChange = new EventEmitter<any[]>();

  stepBuilder!: StepBuilder;
  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() { }

  ngOnInit() {
    if (!this.stepId) {
      throw new Error("@Input() \"stepId\" is required");
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['selectedIndex']) {
        if (changes['selectedIndex'].currentValue !== changes['selectedIndex'].previousValue) {
          this.stepBuilder = this.buildStepById(this.stepId, this.essayTemplateStep);
          this.stepBuilder.buildStepForm();
          this.stepBuilder.form.patchValue(this.actionsRawData);
          this.formValueChanges$(this.stepBuilder.form).subscribe();
        }
      }
    }
  }

  buildStepById(step_id: number, essayTemplateStep: EssayTemplateStep): StepBuilder {
    switch (step_id) {
      case 1:
        return new ReportStep(essayTemplateStep);
      case 4:
        return new ContrastTestStep(essayTemplateStep);
      case 6:
        return new PhotocellAdjustmentStep(essayTemplateStep);
      case 7:
        return new PreparationStep(essayTemplateStep, this.destroyed$);
    }

    return new StepBuilder(essayTemplateStep, [], [], new ReportBuilder());
  }

  formValueChanges$(form: FormGroup): Observable<any[]> {
    return form.valueChanges.pipe(
      takeUntil(this.destroyed$),
      filter(() => JSON.stringify(this.actionsRawData) !== JSON.stringify(form.getRawValue())),
      tap(() => this.actionsRawDataChange.emit(form.getRawValue())), // raw value to include disabled
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
