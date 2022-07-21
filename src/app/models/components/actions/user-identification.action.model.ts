import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class UserIdentificationAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.UserIdentification;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('PENDING');

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      userId: new FormControl(),
    });

    return this.form;
  }
}
