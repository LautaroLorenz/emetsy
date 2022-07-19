import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ActionComponent, ActionLink } from 'src/app/models';

@Component({
  selector: 'app-contrast-test-parameters-action',
  templateUrl: './contrast-test-parameters-action.component.html',
  styleUrls: ['./contrast-test-parameters-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContrastTestParametersActionComponent implements ActionComponent, OnInit, OnDestroy {

  readonly name = 'Parámetros para la prueba de contraste';
  readonly form: FormGroup;

  @Input() actionLink!: ActionLink;
  @Output() actionLinkChange = new EventEmitter<ActionLink>();

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    this.form = new FormGroup({
      maxAllowedError: new FormControl(),
      meterPulses: new FormControl(),
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
