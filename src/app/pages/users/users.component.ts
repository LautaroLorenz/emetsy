import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { AbmColum, User } from 'src/app/models';
import { MessagesService } from 'src/app/services/messages.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  readonly title: string = 'Administración de usuarios';
  readonly haderIcon = PrimeIcons.USERS;
  readonly tableName = 'users';
  users$ = new Observable<User[]>();
  cols: AbmColum[] = [];

  private readonly refreshDataWhenChange = (tableName: string) => {
    this.users$ = this.dbService.getTableReply$(tableName);
  }

  private readonly initDataFromDatabase = (tableName: string) => {
    this.dbService.getTable(tableName);
  }

  constructor(
    private dbService: DatabaseService<User>,
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.cols = [
      {
        field: 'name',
        header: 'Nombre'
      },
      {
        field: 'surname',
        header: 'Apellido'
      },
      {
        field: 'identification',
        header: 'Identificación'
      }
    ];

    this.refreshDataWhenChange(this.tableName);
    this.initDataFromDatabase(this.tableName);
  }

  createUser(user: User) {
    console.log('createUser', { user });
    // this.sqlService.addElementToTable<User>(User.name, user)
    //   .pipe(
    //     first(),
    //   ).subscribe({
    //     next: () => this.messagesService.success('Usuario creado'),
    //     error: () => this.messagesService.error('No se pudo crear el usuario')
    //   })
  }

  deleteUsers(ids: string[] = []) {
    console.log(ids);
    // this.messagesService.success('Elementos eliminados');
  }

  ngOnDestroy() {
    // TODO:
    console.warn('On destroy is empty');
  }

}
