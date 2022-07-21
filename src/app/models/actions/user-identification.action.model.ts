import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class UserIdentificationAction implements Action {

  name = 'Identificación de usuario';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.UserIdentification;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      userId: new FormControl(),
    });

    return this.form;
  }
}
