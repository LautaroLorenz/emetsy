import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { AbmPage, Brand, BrandTableColums, BrandTableName } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent extends AbmPage<Brand> implements OnInit {

  readonly title: string = 'Administración de marcas';
  readonly haderIcon = PrimeIcons.BOOKMARK;
  readonly cols = BrandTableColums;
  readonly form: FormGroup;
  readonly brands$: Observable<Brand[]>;

  constructor(
    private readonly dbService: DatabaseService<Brand>,
    private readonly messagesService: MessagesService,
  ) {
    super(dbService);
    this.brands$ = this.refreshDataWhenDatabaseReply$(BrandTableName);
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(undefined, Validators.required),
      model: new FormControl(undefined, Validators.required),
      connection_id: new FormControl(undefined, Validators.required),
    });
  }

  ngOnInit(): void {
    this.requestTableDataFromDatabase(BrandTableName);
  }

  // private createUser(user: User) {
  //   this.dbService.addElementToTable$(UserTableName, user)
  //     .pipe(
  //       first(),
  //       tap(() => {
  //         this.requestTableDataFromDatabase(UserTableName);
  //         this.messagesService.success('Agregado correctamente');
  //       }),
  //     ).subscribe({
  //       error: () => this.messagesService.error('No se pudo crear el elemento')
  //     });
  // }

  // private editUser(user: User) {
    // this.dbService.editElementFromTable$(UserTableName, user)
    //   .pipe(
    //     first(),
    //     tap(() => {
    //       this.requestTableDataFromDatabase(UserTableName);
    //       this.messagesService.success('Editado correctamente');
    //     }),
    //   ).subscribe({
    //     error: () => this.messagesService.error('No se pudo editar el elemento')
    //   });
  // }

  deleteBrands(ids: string[] = []) {
    // this.dbService.deleteTableElements$(UserTableName, ids)
    //   .pipe(
    //     first(),
    //     filter((numberOfElementsDeleted) => numberOfElementsDeleted === ids.length),
    //     tap(() => {
    //       this.requestTableDataFromDatabase(UserTableName);
    //       this.messagesService.success('Eliminado correctamente');
    //     })
    //   ).subscribe({
    //     error: () => this.messagesService.error('No se pudo borrar')
    //   });
  }

  setFormValues(brand: Brand) {
    this.form.reset();
    this.form.patchValue(brand);
  }

  saveBrand() {
    // if (!this.form.valid) {
    //   return;
    // }

    // const user: User = this.form.getRawValue()
    // if (this.form.get('id')?.value) {
    //   this.editUser(user);
    // } else {
    //   this.createUser(user);
    // }
  }

}

