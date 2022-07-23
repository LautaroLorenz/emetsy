import { FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";

export type ExecutionStatus = 'CREATED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface ActionComponent {
  action: Action;
}

export interface Action {
  actionEnum: ActionEnum;
  form: FormGroup;
  name: string;
  buildForm(): FormGroup;
  executionStatus$: BehaviorSubject<ExecutionStatus>;
}

export enum ActionEnum {
  StandIdentification = 'StandIdentification',
  PhotocellAdjustmentValues = 'PhotocellAdjustmentValues',
  EnterTestValues = 'EnterTestValues',
  ContrastTestParameters = 'ContrastTestParameters',
  ContrastTestExecution = 'ContrastTestExecution',
  PhotocellAdjustmentExecution = 'PhotocellAdjustmentExecution',
  UserIdentification = 'UserIdentification',
}
