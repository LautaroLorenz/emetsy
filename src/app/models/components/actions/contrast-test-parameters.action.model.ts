import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class ContrastTestParametersAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.ContrastTestParameters;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('PENDING');

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      maxAllowedError: new FormControl(),
      meterPulses: new FormControl(),
    });

    return this.form;
  }
}
