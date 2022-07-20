import { FormGroup } from "@angular/forms";

export interface ActionComponent {
  action: Action;
  readonly name: string;
}

export interface Action {
  actionEnum: ActionEnum;
  form: FormGroup;
  buildForm(): FormGroup;
}

export enum ActionEnum {
  StandIdentification = 'StandIdentification',
  PhotocellAdjustmentValues = 'PhotocellAdjustmentValues',
  EnterTestValues = 'EnterTestValues',
  ContrastTestParameters = 'ContrastTestParameters',
  RunConfiguration = 'RunConfiguration',
}