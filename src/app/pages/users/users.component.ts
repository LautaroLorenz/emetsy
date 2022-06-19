import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { first } from 'rxjs';
import { AbmColum, User } from 'src/app/models';
import { MessagesService } from 'src/app/services/messages.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  readonly title: string = 'Administración de usuarios';
  readonly haderIcon = PrimeIcons.USERS;
  users: User[] = [];
  cols: AbmColum[] = [];

  constructor(
    private databaseService: DatabaseService,
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

}
