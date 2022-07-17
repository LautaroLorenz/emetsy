import { ActionLink } from "./step-component.model";

export enum ActionComponentEnum {
  StandIdentification = 'StandIdentification',
  MeterIdentification = 'MeterIdentification',
  PhotocellAdjustmentValues = 'PhotocellAdjustmentValues',
  EnterTestValues = 'EnterTestValues',
}

export interface ActionComponent {
  readonly name: string;
  readonly actionLink: ActionLink;
}