import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class PhotocellAdjustmentExecutionAction implements Action {

  name = 'Realizar ajuste de fotocélula';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.PhotocellAdjustmentExecution;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      photocellAdjustmentExecutionComplete: new FormControl(undefined, [Validators.required]),
    });

    return this.form;
  }
}
