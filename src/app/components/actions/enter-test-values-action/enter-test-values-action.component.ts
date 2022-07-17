import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ActionComponent, ActionLink, MeterConstants } from 'src/app/models';

@Component({
  selector: 'app-enter-test-values-action',
  templateUrl: './enter-test-values-action.component.html',
  styleUrls: ['./enter-test-values-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterTestValuesActionComponent implements ActionComponent, OnInit, OnDestroy {

  readonly name = 'Valores para la prueba';
  readonly form: FormGroup;
  readonly MeterConstants = MeterConstants;

  @Input() actionLink!: ActionLink;
  @Output() actionLinkChange = new EventEmitter<ActionLink>();

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    this.form = new FormGroup({
      testName: new FormControl(),
      meterConstant: new FormControl(0),
      phaseL1: new FormGroup({
        voltageU1: new FormControl(),
        currentI1: new FormControl(),
        anglePhi1: new FormControl(),
      }),
      phaseL2: new FormGroup({
        voltageU2: new FormControl(),
        currentI2: new FormControl(),
        anglePhi2: new FormControl(),
      }),
      phaseL3: new FormGroup({
        voltageU3: new FormControl(),
        currentI3: new FormControl(),
        anglePhi3: new FormControl(),
      }),
    });
  }

  ngOnInit(): void {
    if (this.actionLink.actionOptionalParams && this.actionLink.actionOptionalParams['testName']) {
      const testName = this.form.get('testName')?.value ? this.form.get('testName')?.value : this.actionLink.actionOptionalParams['testName'];
      this.form.get('testName')?.setValue(testName);
    }

    this.form.patchValue(this.actionLink.actionRawData ?? {});
    this.form.valueChanges.pipe(
      takeUntil(this.destroyed$),
      debounceTime(100),
      tap((value) => this.actionLinkChange.emit({
        ...this.actionLink,
        actionRawData: value
      })),
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

