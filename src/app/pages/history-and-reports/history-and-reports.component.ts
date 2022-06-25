import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  templateUrl: './history-and-reports.component.html',
  styleUrls: ['./history-and-reports.component.scss']
})
export class HistoryAndReportsComponent implements OnInit {

  readonly title: string = 'Historial y reportes';
  readonly haderIcon = PrimeIcons.BOOK;

  constructor() { }

  ngOnInit(): void {
  }

}
