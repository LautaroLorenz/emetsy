import { ActionLink } from "./step-component.model";

export enum ActionComponentEnum {
  StandIdentification = 'StandIdentification',
  MeterIdentification = 'MeterIdentification',
  PhotocellAdjustmentValues = 'PhotocellAdjustmentValues',
}

export interface ActionComponent {
  readonly name: string;
  readonly actionLink: ActionLink;
}