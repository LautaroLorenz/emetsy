import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { AbmPage, User, UserTableColums, UserTableName } from 'src/app/models';
import { MessagesService } from 'src/app/services/messages.service';
import { DatabaseService } from 'src/app/services/database.service';
import { filter, first, Observable, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends AbmPage<User> implements OnInit {

  readonly title: string = 'Administración de usuarios';
  readonly haderIcon = PrimeIcons.USERS;
  readonly cols = UserTableColums;
  readonly form: FormGroup;
  readonly users$: Observable<User[]>;

  constructor(
    private readonly dbService: DatabaseService<User>,
    private readonly messagesService: MessagesService,
  ) {
    super(dbService);
    this.users$ = this.refreshDataWhenDatabaseReply$(UserTableName);
    this.form = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      surname: new FormControl(),
      identification: new FormControl(undefined, Validators.required),
    });
  }

  ngOnInit(): void {
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
    this.dbService.editElementFromTable$(UserTableName, user)
      .pipe(
        first(),
        tap(() => {
          this.requestTableDataFromDatabase(UserTableName);
          this.messagesService.success('Editado correctamente');
        }),
      ).subscribe({
        error: () => this.messagesService.error('No se pudo editar el elemento')
      });
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
      ).subscribe({
        error: () => this.messagesService.error('No se pudo borrar')
      });
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

}
