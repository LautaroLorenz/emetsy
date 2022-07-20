import { ActionLink } from "./step-component.model";

export enum ActionComponentEnum {
  StandIdentification = 'StandIdentification',
  MeterIdentification = 'MeterIdentification',
  PhotocellAdjustmentValues = 'PhotocellAdjustmentValues',
  EnterTestValues = 'EnterTestValues',
  ContrastTestParameters = 'ContrastTestParameters',
  RunConfiguration = 'RunConfiguration',
}

export interface ActionComponent {
  readonly name: string;
  readonly actionLink: ActionLink;
}