import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { filter, first, Observable, tap } from 'rxjs';
import { AbmPage, Brand, BrandTableColumns, BrandDbTableContext, Connection, ConnectionDbTableContext } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent extends AbmPage<Brand> implements OnInit {

  readonly title: string = 'Administración de marcas';
  readonly haderIcon = PrimeIcons.BOOKMARK;
  readonly cols = BrandTableColumns;
  readonly form: FormGroup;
  readonly brands$: Observable<Brand[]>;

  dropdownConnectionOptions: Connection[] = [];

  private readonly updateDropdownOptions = (): void => {
    this.dropdownConnectionOptions = this._relations[ConnectionDbTableContext.tableName].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
  }

  constructor(
    private readonly dbService: DatabaseService<Brand>,
    private readonly messagesService: MessagesService,
  ) {
    super(dbService, BrandDbTableContext);
    this.brands$ = this.refreshDataWhenDatabaseReply$(BrandDbTableContext.tableName).pipe(
      tap(() => this.updateDropdownOptions())
    );
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(undefined, Validators.required),
      model: new FormControl(undefined, Validators.required),
      connection_id: new FormControl(undefined, Validators.required),
    });
  }

  ngOnInit(): void {
    this.dbService.getTable(
      BrandDbTableContext.tableName,
      BrandDbTableContext.foreignTables.map(ft => ft.tableName)
    );
  }

  private createBrand(brand: Brand) {
    this.dbService.addElementToTable$(BrandDbTableContext.tableName, brand)
      .pipe(
        first(),
        tap(() => {
          this.dbService.getTable(BrandDbTableContext.tableName);
          this.messagesService.success('Agregado correctamente');
        }),
      ).subscribe({
        error: () => this.messagesService.error('No se pudo crear el elemento')
      });
  }

  private editBrand(brand: Brand) {
  this.dbService.editElementFromTable$(BrandDbTableContext.tableName, brand)
    .pipe(
      first(),
      tap(() => {
        this.dbService.getTable(BrandDbTableContext.tableName);
        this.messagesService.success('Editado correctamente');
      }),
    ).subscribe({
      error: () => this.messagesService.error('No se pudo editar el elemento')
    });
  }

  deleteBrands(ids: string[] = []) {
    this.dbService.deleteTableElements$(BrandDbTableContext.tableName, ids)
      .pipe(
        first(),
        filter((numberOfElementsDeleted) => numberOfElementsDeleted === ids.length),
        tap(() => {
          this.dbService.getTable(BrandDbTableContext.tableName);
          this.messagesService.success('Eliminado correctamente');
        })
      ).subscribe({
        error: () => this.messagesService.error('Verifique que ningun elemento este en uso antes de eliminar')
      });
  }

  setFormValues(brand: Brand) {
    this.form.reset();
    this.form.patchValue(brand);
  }

  saveBrand() {
    if (!this.form.valid) {
      return;
    }

    const brand: Brand = this.form.getRawValue()
    if (this.form.get('id')?.value) {
      this.editBrand(brand);
    } else {
      this.createBrand(brand);
    }
  }

}

