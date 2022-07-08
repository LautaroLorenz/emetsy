import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { PageUrlName } from 'src/app/models';

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
        routerLink: '/'.concat(PageUrlName.availableTest),
      },
      {
        label: 'Historial y reportes',
        icon: PrimeIcons.BOOK,
        routerLink: '/'.concat(PageUrlName.historyAndReports),
      },
    ];
  }

  ngOnInit(): void {
  }

}
