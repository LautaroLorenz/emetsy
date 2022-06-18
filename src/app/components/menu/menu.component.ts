import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
  items: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Ensayos',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Ensayos disponibles',
            icon: PrimeIcons.BRIEFCASE,
            routerLink: '/ensayos-disponibles'
          },
          {
            label: 'Historial y reportes',
            icon: PrimeIcons.BOOK,
            routerLink: '/historial-y-reportes'
          }
        ]
      },
      {
        label: 'ABMs',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Medidores',
            icon: PrimeIcons.BOX,
            routerLink: '/medidores'
          },
          {
            label: 'Marcas',
            icon: PrimeIcons.BOOKMARK,
            routerLink: '/marcas'
          },
          {
            label: 'Usuarios',
            icon: PrimeIcons.USERS,
            routerLink: '/usuarios'
          }
        ]
      },
      {
        label: 'Backup',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Importar',
            icon: PrimeIcons.UPLOAD,
            routerLink: '/importar'
          },
          {
            label: 'Exportar',
            icon: PrimeIcons.DOWNLOAD,
            routerLink: '/exportar'
          }
        ]
      }
    ];
  }

}
