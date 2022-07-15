import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActionComponentEnum } from 'src/app/models';

@Component({
  selector: 'app-action-switch',
  templateUrl: './action-switch.component.html',
  styleUrls: ['./action-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionSwitchComponent implements OnInit {

  @Input() actionComponentEnums!: ActionComponentEnum[];
  readonly ActionComponentEnum = ActionComponentEnum;

  constructor() { }

  ngOnInit(): void {
    if(!this.actionComponentEnums) {
      throw new Error("@Input() \"actionComponentEnums\" is required");
    }
  }

}
