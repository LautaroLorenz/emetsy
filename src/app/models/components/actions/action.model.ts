import { FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

export type ExecutionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface ActionComponent {
  action: Action;
  readonly name: string;
}

export interface Action {
  actionEnum: ActionEnum;
  form: FormGroup;
  buildForm(): FormGroup;
  executionStatus$: BehaviorSubject<ExecutionStatus>;
}

export enum ActionEnum {
  StandIdentification = 'StandIdentification',
  PhotocellAdjustmentValues = 'PhotocellAdjustmentValues',
  EnterTestValues = 'EnterTestValues',
  ContrastTestParameters = 'ContrastTestParameters',
  RunConfiguration = 'RunConfiguration',
  ContrastTestExecution = 'ContrastTestExecution',
  MeterIdentification = 'MeterIdentification',
  PhotocellAdjustmentExecution = 'PhotocellAdjustmentExecution',
  UserIdentification = 'UserIdentification',
}
