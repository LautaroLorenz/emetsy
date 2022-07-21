import { FormControl, FormGroup } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class ContrastTestParametersAction implements Action {

  name = 'Parámetros para la prueba de contraste';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.ContrastTestParameters;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  numberOfDiscardedResults: number;

  constructor(numberOfDiscardedResults: number) {
    this.numberOfDiscardedResults = numberOfDiscardedResults;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      maxAllowedError: new FormControl(),
      meterPulses: new FormControl(),
      numberOfDiscardedResults: new FormControl(this.numberOfDiscardedResults),
    });

    return this.form;
  }
}
