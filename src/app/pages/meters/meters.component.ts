import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { filter, first, Observable, ReplaySubject, takeUntil, tap } from 'rxjs';
import { AbmPage, ActiveConstantUnit, ActiveConstantUnitDbTableContext, Brand, BrandDbTableContext, Meter, MeterDbTableContext, MeterTableColumns, ReactiveConstantUnit, ReactiveConstantUnitDbTableContext } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.scss']
})
export class MetersComponent extends AbmPage<Meter> implements OnInit, OnDestroy {

  readonly title: string = 'Administración de medidores';
  readonly haderIcon = PrimeIcons.BOX;
  readonly cols = MeterTableColumns;
  readonly form: FormGroup;
  readonly meters$: Observable<Meter[]>;

  dropdownActiveConstantUnitOptions: ActiveConstantUnit[] = [];
  dropdownReactiveConstantUnitOptions: ReactiveConstantUnit[] = [];
  dropdownBrandOptions: Brand[] = [];

  private readonly updateDropdownOptions = (): void => {
    this.dropdownActiveConstantUnitOptions = this._relations[ActiveConstantUnitDbTableContext.tableName].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    this.dropdownReactiveConstantUnitOptions = this._relations[ReactiveConstantUnitDbTableContext.tableName].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    this.dropdownBrandOptions = this._relations[BrandDbTableContext.tableName].map(
      brand => ({
        ...brand,
        name: `${brand.name} - ${brand.model}`,
      })
    ).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly dbService: DatabaseService<Meter>,
    private readonly messagesService: MessagesService,
  ) {
    super(dbService, MeterDbTableContext);
    this.meters$ = this.refreshDataWhenDatabaseReply$(MeterDbTableContext.tableName).pipe(
      tap(() => this.updateDropdownOptions())
    );
    this.form = new FormGroup({
      id: new FormControl(),
      maximumCurrent: new FormControl(undefined, Validators.required),
      ratedCurrent: new FormControl(undefined, Validators.required),
      ratedVoltage: new FormControl(undefined, Validators.required),
      activeConstantValue: new FormControl(undefined, Validators.required),
      activeConstantUnit_id: new FormControl(undefined, Validators.required),
      reactiveConstantValue: new FormControl(undefined, Validators.required),
      reactiveConstantUnit_id: new FormControl(undefined, Validators.required),
      brand_id: new FormControl(undefined, Validators.required),
    });
    this.initFormValueChangeListeners();
  }

  ngOnInit(): void {
    this.dbService.getTable(
      MeterDbTableContext.tableName,
      { relations: MeterDbTableContext.foreignTables.map(ft => ft.tableName) }
    );
  }

  private initFormValueChangeListeners(): void {
    this.form.get('activeConstantUnit_id')?.valueChanges.pipe(
      takeUntil(this.destroyed$),
      filter((id) => id !== null),
      filter((id) => id !== undefined),
      filter(() => !this.form.get('reactiveConstantUnit_id')?.value),
      tap((id) => this.form.get('reactiveConstantUnit_id')?.setValue(id)),
    ).subscribe();
    this.form.get('reactiveConstantUnit_id')?.valueChanges.pipe(
      takeUntil(this.destroyed$),
      filter((id) => id !== null),
      filter((id) => id !== undefined),
      filter(() => !this.form.get('activeConstantUnit_id')?.value),
      tap((id) => this.form.get('activeConstantUnit_id')?.setValue(id)),
    ).subscribe();
  }

  private createMeter(meter: Meter) {
    this.dbService.addElementToTable$(MeterDbTableContext.tableName, meter)
      .pipe(
        first(),
        tap(() => {
          this.dbService.getTable(MeterDbTableContext.tableName);
          this.messagesService.success('Agregado correctamente');
        }),
      ).subscribe({
        error: () => this.messagesService.error('No se pudo crear el elemento')
      });
  }

  private editMeter(meter: Meter) {
    this.dbService.editElementFromTable$(MeterDbTableContext.tableName, meter)
      .pipe(
        first(),
        tap(() => {
          this.dbService.getTable(MeterDbTableContext.tableName);
          this.messagesService.success('Editado correctamente');
        }),
      ).subscribe({
        error: () => this.messagesService.error('No se pudo editar el elemento')
      });
  }

  deleteMeters(ids: string[] = []) {
    this.dbService.deleteTableElements$(MeterDbTableContext.tableName, ids)
      .pipe(
        first(),
        filter((numberOfElementsDeleted) => numberOfElementsDeleted === ids.length),
        tap(() => {
          this.dbService.getTable(MeterDbTableContext.tableName);
          this.messagesService.success('Eliminado correctamente');
        })
      ).subscribe({
        error: () => this.messagesService.error('Verifique que ningun elemento este en uso antes de eliminar')
      });
  }

  setFormValues(meter: Meter) {
    this.form.reset();
    this.form.patchValue(meter);
  }

  saveMeter() {
    if (!this.form.valid) {
      return;
    }

    const meter: Meter = this.form.getRawValue()
    if (this.form.get('id')?.value) {
      this.editMeter(meter);
    } else {
      this.createMeter(meter);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
