import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionComponent } from 'src/app/models';

@Component({
  selector: 'app-meter-identification-action',
  templateUrl: './meter-identification-action.component.html',
  styleUrls: ['./meter-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeterIdentificationActionComponent implements ActionComponent, OnInit {

  name = 'Identificación de medidores';

  constructor() { }

  ngOnInit(): void {
  }

}
