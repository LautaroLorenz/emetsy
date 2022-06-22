import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent implements OnInit {
  @Input() title: string = '';
  @Input() headerIcon: PrimeIcons = '';

  constructor() { }

  ngOnInit(): void {
  }

}
