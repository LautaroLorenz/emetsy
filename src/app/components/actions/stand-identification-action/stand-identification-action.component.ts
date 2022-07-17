import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, map, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ActionComponent, ActionLink, CompileParams, Meter, MeterDbTableContext, RelationsManager } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { standIdentificationValidator } from 'src/app/validators';

@Component({
  selector: 'app-stand-identification-action',
  templateUrl: './stand-identification-action.component.html',
  styleUrls: ['./stand-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandIdentificationActionComponent implements ActionComponent, OnInit, OnDestroy {

  readonly name = 'Identificación de puestos';
  readonly form: FormGroup;

  @Input() actionLink!: ActionLink;
  @Output() actionLinkChange = new EventEmitter<ActionLink>();

  standsBuilded = false;
  dropdownMeterOptions: Meter[] = [];

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly lisenRequestReplyDropdownOptions = (): void => {
    this.dbServiceMeters.getTableReply$(MeterDbTableContext.tableName).pipe(
      takeUntil(this.destroyed$),
      map((response) => {
        const { foreignTables } = MeterDbTableContext;
        return RelationsManager.mergeRelationsIntoRows<Meter>(response.rows, response.relations, foreignTables)
      }),
      map((rows) => (rows.map(x => ({
        ...x,
        label: `${x.foreign.brand.name} - ${x.model}`
      })))),
      map((rows) => (rows.sort(
        (a, b) => a.label.localeCompare(b.label)
      ))),
      tap((rows) => this.dropdownMeterOptions = rows),
      tap(() => this.form.updateValueAndValidity()),
      tap(() => this.standsBuilded = true),
    ).subscribe();
  }

  constructor(
    private readonly dbServiceMeters: DatabaseService<Meter>,
  ) {
    this.form = new FormGroup({
      stands: new FormArray<FormGroup>([], standIdentificationValidator())
    });
  }

  private addStandInput(initValue: any): void {
    this.getStandGroups().push(new FormGroup({
      isActive: new FormControl(initValue?.isActive),
      meterId: new FormControl({ value: initValue?.meterId, disabled: !initValue?.isActive })
    }));
  }

  private buildStands(stands: any[]): void {
    for (let i = 0; i < CompileParams.STANDS_LENGTH; i++) {
      const value = (stands && stands[i]) ?? {};
      this.addStandInput(value);
    }
  }

  private requestDropdownOptions(): void {
    this.dbServiceMeters.getTable(
      MeterDbTableContext.tableName,
      { relations: MeterDbTableContext.foreignTables.map(ft => ft.tableName) }
    );
  }

  ngOnInit(): void {
    const { stands } = this.actionLink.actionRawData ?? [];
    this.buildStands(stands);
    this.lisenRequestReplyDropdownOptions();
    this.requestDropdownOptions();
    this.form.valueChanges.pipe(
      takeUntil(this.destroyed$),
      debounceTime(100),
      tap((value) => this.actionLinkChange.emit({
        ...this.actionLink,
        actionRawData: value
      })),
    ).subscribe();
  }

  getStandGroups(): FormArray<FormGroup> {
    return (this.form.get('stands') as FormArray);
  }

  inputIsActiveChange(group: FormGroup): void {
    const isActive = group.get('isActive')?.value;
    isActive ? group.get('meterId')?.enable() : group.get('meterId')?.disable();
    !isActive && group.get('meterId')?.reset()
  }

  copyToAllActive(group: FormGroup): void {
    this.getStandGroups().controls.forEach((control) => {
      if (!control.get('isActive')?.value) {
        return;
      }

      control.patchValue(group.value);
      this.inputIsActiveChange(control);
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
