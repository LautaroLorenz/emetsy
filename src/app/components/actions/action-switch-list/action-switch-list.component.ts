import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Action, ActionEnum } from 'src/app/models';

@Component({
  selector: 'app-action-switch-list',
  templateUrl: './action-switch-list.component.html',
  styleUrls: ['./action-switch-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionSwitchListComponent implements OnInit {

  @Input() actions!: Action[];
  readonly ActionEnum = ActionEnum;

  constructor() { }

  ngOnInit(): void {
    if (!this.actions) {
      throw new Error("@Input() \"actions\" is required");
    }
  }

}
