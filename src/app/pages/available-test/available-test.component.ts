import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  templateUrl: './available-test.component.html',
  styleUrls: ['./available-test.component.scss']
})
export class AvailableTestComponent implements OnInit {

  readonly title: string = 'Administración de ensayos disponibles';
  readonly haderIcon = PrimeIcons.BRIEFCASE;

  constructor() { }

  ngOnInit(): void {
  }

}
