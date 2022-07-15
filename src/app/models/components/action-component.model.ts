export enum ActionComponentEnum {
  StandIdentification = 'StandIdentification',
  MeterIdentification = 'MeterIdentification',
}

export interface ActionComponent {
  readonly name: string;
}