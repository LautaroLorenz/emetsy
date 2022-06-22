import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { filter, first, Observable, tap } from 'rxjs';
import { AbmPage, Brand, BrandDbTableContext } from 'src/app/models';
import { ConstantUnit, ConstantUnitDbTableContext } from 'src/app/models/constant-unit.model';
import { Meter, MeterDbTableContext, MeterTableColumns } from 'src/app/models/meter.model';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './meters.component.html',
  styleUrls: ['./meters.component.scss']
})
export class MetersComponent extends AbmPage<Meter> implements OnInit {

  readonly title: string = 'Administración de medidores';
  readonly haderIcon = PrimeIcons.BOX;
  readonly cols = MeterTableColumns;
  readonly form: FormGroup;
  readonly meters$: Observable<Meter[]>;

  get dropdownConstantUnitOptions(): ConstantUnit[] {
    return this._relations[ConstantUnitDbTableContext.tableName];
  }

  get dropdownBrandOptions(): Brand[] {
    return this._relations[BrandDbTableContext.tableName];
  }

  constructor(
    private readonly dbService: DatabaseService<Meter>,
    private readonly messagesService: MessagesService,
  ) {
    super(dbService, MeterDbTableContext);
    this.meters$ = this.refreshDataWhenDatabaseReply$(MeterDbTableContext.tableName);
    this.form = new FormGroup({
      id: new FormControl(),
      current: new FormControl(undefined, Validators.required),
      voltage: new FormControl(undefined, Validators.required),
      activeConstantValue: new FormControl(undefined, Validators.required),
      activeConstantUnit_id: new FormControl(undefined, Validators.required),
      reactveConstantValue: new FormControl(undefined, Validators.required),
      reactiveConstantUnit_id: new FormControl(undefined, Validators.required),
      brand_id: new FormControl(undefined, Validators.required),
    });
  }

  ngOnInit(): void {
    this.requestTableDataFromDatabase(
      MeterDbTableContext.tableName,
      MeterDbTableContext.foreignTables.map(ft => ft.tableName)
    );
  }

  private createMeter(meter: Meter) {
    // this.dbService.addElementToTable$(MeterDbTableContext.tableName, brand)
    //   .pipe(
    //     first(),
    //     tap(() => {
    //       this.requestTableDataFromDatabase(MeterDbTableContext.tableName);
    //       this.messagesService.success('Agregado correctamente');
    //     }),
    //   ).subscribe({
    //     error: () => this.messagesService.error('No se pudo crear el elemento')
    //   });
  }

  private editMeter(meter: Meter) {
  // this.dbService.editElementFromTable$(MeterDbTableContext.tableName, brand)
  //   .pipe(
  //     first(),
  //     tap(() => {
  //       this.requestTableDataFromDatabase(MeterDbTableContext.tableName);
  //       this.messagesService.success('Editado correctamente');
  //     }),
  //   ).subscribe({
  //     error: () => this.messagesService.error('No se pudo editar el elemento')
  //   });
  }

  deleteMeters(ids: string[] = []) {
    this.dbService.deleteTableElements$(MeterDbTableContext.tableName, ids)
      .pipe(
        first(),
        filter((numberOfElementsDeleted) => numberOfElementsDeleted === ids.length),
        tap(() => {
          this.requestTableDataFromDatabase(MeterDbTableContext.tableName);
          this.messagesService.success('Eliminado correctamente');
        })
      ).subscribe({
        error: () => this.messagesService.error('No se pudo borrar')
      });
  }

  setFormValues(meter: Meter) {
    this.form.reset();
    this.form.patchValue(meter);
  }

  saveMeter() {
    // if (!this.form.valid) {
    //   return;
    // }

    // const brand: Brand = this.form.getRawValue()
    // if (this.form.get('id')?.value) {
    //   this.editBrand(brand);
    // } else {
    //   this.createBrand(brand);
    // }
  }
}
