import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { map, ReplaySubject, takeUntil, tap } from 'rxjs';
import { Action, ActionComponent, Meter, MeterDbTableContext, RelationsManager, StandIdentificationAction } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-stand-identification-action',
  templateUrl: './stand-identification-action.component.html',
  styleUrls: ['./stand-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandIdentificationActionComponent implements ActionComponent, AfterViewInit, OnDestroy {

  dropdownMeterOptions: Meter[] = [];

  @Input() action!: Action;

  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }
  get standArray(): FormArray<FormGroup> {
    return (this.action as StandIdentificationAction).standArray;
  }

  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
      tap(() => this.form.updateValueAndValidity({ emitEvent: true })),
      tap(() => this.changeDetectorRef.detectChanges()),
    ).subscribe();
  }

  private requestDropdownOptions = (): void => {
    this.dbServiceMeters.getTable(
      MeterDbTableContext.tableName,
      { relations: MeterDbTableContext.foreignTables.map(ft => ft.tableName) }
    );
  }

  constructor(
    private readonly dbServiceMeters: DatabaseService<Meter>,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngAfterViewInit(): void {
    this.lisenRequestReplyDropdownOptions();
    this.requestDropdownOptions();
  }

  copyToAllActive(group: FormGroup): void {
    this.standArray.controls.forEach((control) => {
      if (!control.get('isActive')?.value) {
        return;
      }
      control.patchValue(group.value);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
