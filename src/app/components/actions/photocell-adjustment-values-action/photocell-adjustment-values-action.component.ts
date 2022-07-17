import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ActionComponent, ActionLink } from 'src/app/models';

@Component({
  selector: 'app-photocell-adjustment-values-action',
  templateUrl: './photocell-adjustment-values-action.component.html',
  styleUrls: ['./photocell-adjustment-values-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentValuesActionComponent implements ActionComponent, OnInit, OnDestroy {

  readonly name = 'Valores para ajuste de fotocélula';
  readonly form: FormGroup;

  @Input() actionLink!: ActionLink;
  @Output() actionLinkChange = new EventEmitter<ActionLink>();

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    this.form = new FormGroup({
      phaseL1: new FormGroup({
        voltageU1: new FormControl(),
        currentI1: new FormControl(),
      }),
      phaseL2: new FormGroup({
        voltageU2: new FormControl(),
        currentI2: new FormControl(),
      }),
      phaseL3: new FormGroup({
        voltageU3: new FormControl(),
        currentI3: new FormControl(),
      }),
    });
  }

  ngOnInit(): void {
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
