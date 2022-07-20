import { FormControl, FormGroup } from "@angular/forms";
import { Action, ActionEnum } from "./action.model";

export class ContrastTestParametersAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.ContrastTestParameters;

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      maxAllowedError: new FormControl(),
      meterPulses: new FormControl(),
    });

    return this.form;
  }
}
