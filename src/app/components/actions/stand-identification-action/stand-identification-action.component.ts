import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { map, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ActionComponent, CompileParams, Meter, MeterDbTableContext, RelationsManager } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-stand-identification-action',
  templateUrl: './stand-identification-action.component.html',
  styleUrls: ['./stand-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandIdentificationActionComponent implements ActionComponent, OnInit, OnDestroy {

  readonly name = 'Identificación de puestos';
  readonly form: FormGroup;

  @Output() valueChanges = new EventEmitter();

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
    ).subscribe();
  }

  constructor(
    private readonly dbServiceMeters: DatabaseService<Meter>
  ) {
    this.form = new FormGroup({
      stands: new FormArray<FormGroup>([])
    });
  }

  private addStandInput(): void {
    this.getStandGroups().push(new FormGroup({
      isActive: new FormControl(),
      meterId: new FormControl()
    }));
  }

  private buildStands(): void {
    for (let i = 0; i < CompileParams.STANDS_LENGTH; i++) {
      this.addStandInput();
    }
  }

  private requestDropdownOptions(): void {
    this.dbServiceMeters.getTable(
      MeterDbTableContext.tableName,
      { relations: MeterDbTableContext.foreignTables.map(ft => ft.tableName) }
    );
  }

  ngOnInit(): void {
    this.buildStands();
    this.lisenRequestReplyDropdownOptions();
    this.requestDropdownOptions();
    this.form.valueChanges.pipe(
      takeUntil(this.destroyed$),
      tap((value) => this.valueChanges.emit(value)),
    ).subscribe();
  }

  getStandGroups(): FormArray<FormGroup> {
    return (this.form.get('stands') as FormArray);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
