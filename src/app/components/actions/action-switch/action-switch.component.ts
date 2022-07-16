import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionComponentEnum, ActionLink } from 'src/app/models';

@Component({
  selector: 'app-action-switch',
  templateUrl: './action-switch.component.html',
  styleUrls: ['./action-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionSwitchComponent implements OnInit {

  @Input() actionLinks!: ActionLink[];
  @Output() actionLinksChange = new EventEmitter<ActionLink[]>();
  readonly ActionComponentEnum = ActionComponentEnum;

  constructor() { }

  ngOnInit(): void {
    if(!this.actionLinks) {
      throw new Error("@Input() \"actionLinks\" is required");
    }
  }

  setActionLinkValue(actionLink: ActionLink, index: number): void {
    this.actionLinks[index] = actionLink;
    this.actionLinksChange.emit(this.actionLinks);
  }

}
