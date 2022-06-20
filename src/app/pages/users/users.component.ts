import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { User, UserTableColums, UserTableName } from 'src/app/models';
import { MessagesService } from 'src/app/services/messages.service';
import { DatabaseService } from 'src/app/services/database.service';
import { filter, first, Observable, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  readonly title: string = 'Administración de usuarios';
  readonly haderIcon = PrimeIcons.USERS;
  readonly cols = UserTableColums;
  readonly form: FormGroup;
  users$: Observable<User[]> = new Observable<User[]>();

  private readonly refreshDataWhenDatabaseReply = (tableName: string) => {
    this.users$ = this.dbService.getTableReply$(tableName);
  }
  private readonly requestTableDataFromDatabase = (tableName: string) => {
    this.dbService.getTable(tableName);
  }

  constructor(
    private readonly dbService: DatabaseService<User>,
    private readonly messagesService: MessagesService,
  ) {
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      surname: new FormControl(),
      identification: new FormControl(undefined, Validators.required),
    });
  }

  ngOnInit(): void {
    this.refreshDataWhenDatabaseReply(UserTableName);
    this.requestTableDataFromDatabase(UserTableName);
  }

  private createUser(user: User) {
    this.dbService.addElementToTable$(UserTableName, user)
      .pipe(
        first(),
        tap(() => {
          this.requestTableDataFromDatabase(UserTableName);
          this.messagesService.success('Agregado correctamente');
        }),
      ).subscribe({
        error: () => this.messagesService.error('No se pudo crear el elemento')
      });
  }

  private editUser(user: User) {
    // this.dbService.addElementToTable$(UserTableName, user)
    //   .pipe(
    //     first(),
    //     tap(() => {
    //       this.requestTableDataFromDatabase(UserTableName);
    //       this.messagesService.success('Agregado correctamente');
    //     }),
    //   ).subscribe({
    //     error: () => this.messagesService.error('No se pudo crear el elemento')
    //   });
  }

  setFormValues(user: User) {
    this.form.reset();
    this.form.patchValue(user);
  }

  saveUser() {
    if (!this.form.valid) {
      return;
    }

    const user: User = this.form.getRawValue()
    if (this.form.get('id')?.value) {
      this.editUser(user);
    } else {
      this.createUser(user);
    }
  }

  deleteUsers(ids: string[] = []) {
    this.dbService.deleteTableElements$(UserTableName, ids)
      .pipe(
        first(),
        filter((numberOfElementsDeleted) => numberOfElementsDeleted === ids.length),
        tap(() => {
          this.requestTableDataFromDatabase(UserTableName);
          this.messagesService.success('Eliminado correctamente');
        })
      ).subscribe();
  }

}
