import { FormArray, FormGroup } from "@angular/forms";
import { Action } from "../actions/action.model";

export class StepBuilder {
  form: FormGroup;
  actions: Action[];
  buildActions: Action[];  
  
  private get formActionsArray(): FormArray<FormGroup> {
    return this.form.get('actions') as FormArray<FormGroup>;
  }

  constructor(actions: Action[], buildActions: Action[]) {
    this.actions = actions;
    this.buildActions = buildActions;
    this.form = new FormGroup({
      actions: new FormArray([])
    });
  }

  buildStepForm(): void {
    this.actions.forEach((action) => {
      this.formActionsArray.push(action.buildForm());
    });
  }
}