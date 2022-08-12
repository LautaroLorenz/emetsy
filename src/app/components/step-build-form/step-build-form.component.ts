import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, Observable, ReplaySubject, takeUntil, tap } from 'rxjs';
import { EssayTemplateStep, StepBuilder, StepConstructor } from 'src/app/models';

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
          this.stepBuilder = StepConstructor.buildStepById(this.stepId, this.essayTemplateStep, this.destroyed$);
          this.stepBuilder.buildStepForm();
          this.stepBuilder.form.patchValue(this.actionsRawData);
          this.formValueChanges$(this.stepBuilder.form).subscribe();
        }
      }
    }
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
