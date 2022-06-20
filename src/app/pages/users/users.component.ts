import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { User, UserTableColums, UserTableName } from 'src/app/models';
import { MessagesService } from 'src/app/services/messages.service';
import { DatabaseService } from 'src/app/services/database.service';
import { filter, first, Observable, tap } from 'rxjs';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  readonly title: string = 'Administración de usuarios';
  readonly haderIcon = PrimeIcons.USERS;
  readonly cols = UserTableColums;
  users$: Observable<User[]> = new Observable<User[]>();

  private readonly refreshDataWhenDatabaseReply = (tableName: string) => {
    this.users$ = this.dbService.getTableReply$(tableName).pipe(tap(console.warn));
  }
  private readonly requestTableDataFromDatabase = (tableName: string) => {
    this.dbService.getTable(tableName);
  }

  constructor(
    private dbService: DatabaseService<User>,
    private messagesService: MessagesService,
  ) { }

  ngOnInit(): void {
    this.refreshDataWhenDatabaseReply(UserTableName);
    this.requestTableDataFromDatabase(UserTableName);
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
