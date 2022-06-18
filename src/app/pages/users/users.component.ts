import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { AbmColum, User } from 'src/app/models';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  readonly title: string = 'Administración de usuarios';
  readonly haderIcon = PrimeIcons.USERS;
  users: User[] = [];
  cols: AbmColum[] = [];

  constructor() { }

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

    this.users = [
      {
        name: 'Lautaro',
        surname: 'Lorenz',
        identification: Math.random().toString(),
      },
      {
        name: 'Gabriel',
        surname: 'Maciel',
        identification: Math.random().toString(),
      },
      {
        name: 'Marcelo',
        surname: 'Lorenz',
        identification: Math.random().toString(),
      },
      {
        name: 'Gustavo',
        surname: 'Celestino',
        identification: Math.random().toString(),
      },
      {
        name: 'Juan',
        surname: 'Barrios',
        identification: Math.random().toString(),
      },
      {
        name: 'Pablo',
        surname: 'Arce',
        identification: Math.random().toString(),
      },
      {
        name: 'Gabriel',
        surname: 'Maciel',
        identification: Math.random().toString(),
      },
      {
        name: 'Marcelo',
        surname: 'Lorenz',
        identification: Math.random().toString(),
      },
      {
        name: 'Gustavo',
        surname: 'Celestino',
        identification: Math.random().toString(),
      },
      {
        name: 'Juan',
        surname: 'Barrios',
        identification: Math.random().toString(),
      },
      {
        name: 'Pablo',
        surname: 'Arce',
        identification: Math.random().toString(),
      }
    ];
  }

}
