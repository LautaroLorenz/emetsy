import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent implements OnInit {

  @Input() title: string = '';
  @Input() headerIcon: PrimeIcons | null = null;
  @Input() showBack: boolean = false;

  @Output() backEvent = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void { }
}
