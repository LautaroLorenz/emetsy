import { FormControl, FormGroup } from "@angular/forms";
import { Action, ActionEnum } from "./action.model";

export class RunConfigurationAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.RunConfiguration;
  completionMode: number;
  numberOfDiscardedResults: number;

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
