import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ActionComponent, ActionLink, CompleteModeConstants } from 'src/app/models';

@Component({
  selector: 'app-run-configuration-action',
  templateUrl: './run-configuration-action.component.html',
  styleUrls: ['./run-configuration-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunConfigurationActionComponent implements ActionComponent, OnInit, OnDestroy {

  readonly name = 'Configuración de la ejecución';
  readonly form: FormGroup;
  readonly CompleteModeConstants = CompleteModeConstants;

  @Input() actionLink!: ActionLink;
  @Output() actionLinkChange = new EventEmitter<ActionLink>();

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    this.form = new FormGroup({
      completionMode: new FormControl()
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
