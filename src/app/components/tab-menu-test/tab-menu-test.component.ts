import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-tab-menu-test',
  templateUrl: './tab-menu-test.component.html',
  styleUrls: ['./tab-menu-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabMenuTestComponent implements OnInit {

  readonly items: MenuItem[];

  constructor() {
    this.items = [
      {
        label: 'Ensayos disponibles',
        icon: PrimeIcons.BRIEFCASE,
        routerLink: '/ensayos-disponibles',
      },
      {
        label: 'Historial y reportes',
        icon: PrimeIcons.BOOK,
        routerLink: '/historial-y-reportes',
      },
    ];
  }

  ngOnInit(): void {
  }

}
