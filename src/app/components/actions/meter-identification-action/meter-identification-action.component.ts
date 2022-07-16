import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionComponent, ActionLink } from 'src/app/models';

@Component({
  selector: 'app-meter-identification-action',
  templateUrl: './meter-identification-action.component.html',
  styleUrls: ['./meter-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeterIdentificationActionComponent implements ActionComponent, OnInit {

  readonly name = 'Identificación de medidores';
  @Input() actionLink!: ActionLink;
  @Output() actionLinkChange = new EventEmitter<ActionLink>();

  constructor() { }

  ngOnInit(): void {
  }

}
