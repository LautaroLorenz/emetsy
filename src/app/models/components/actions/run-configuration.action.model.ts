import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class RunConfigurationAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.RunConfiguration;
  completionMode: number;
  numberOfDiscardedResults: number;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('PENDING');

  constructor(completionMode: number, numberOfDiscardedResults: number) {
    this.completionMode = completionMode;
    this.numberOfDiscardedResults = numberOfDiscardedResults;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      completionMode: new FormControl(this.completionMode),
      numberOfDiscardedResults: new FormControl(this.numberOfDiscardedResults),
    });

    return this.form;
  }
}
