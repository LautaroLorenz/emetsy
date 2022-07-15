import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionComponent } from 'src/app/models';

@Component({
  selector: 'app-stand-identification-action',
  templateUrl: './stand-identification-action.component.html',
  styleUrls: ['./stand-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandIdentificationActionComponent implements ActionComponent, OnInit {

  name = 'Identificación de puestos';

  constructor() { }

  ngOnInit(): void {
  }

}
