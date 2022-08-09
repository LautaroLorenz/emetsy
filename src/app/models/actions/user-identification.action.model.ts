import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { User } from "../database/tables/user.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class UserIdentificationAction implements Action {

  name = 'Identificación de usuario';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.UserIdentification;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  selectedUser: User | undefined = undefined;

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      userId: new FormControl(undefined, [Validators.required]),
    });

    return this.form;
  }
}
