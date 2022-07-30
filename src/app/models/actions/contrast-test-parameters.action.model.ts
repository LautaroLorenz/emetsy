import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { ContrastTestParametersActionForm } from "../forms/contrast-test-parameters-action.form.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class ContrastTestParametersAction implements Action {

  name = 'Parámetros para la prueba de contraste';
  form!: FormGroup<ContrastTestParametersActionForm>;
  actionEnum: ActionEnum = ActionEnum.ContrastTestParameters;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  numberOfDiscardedResults: number;

  constructor(numberOfDiscardedResults: number) {
    this.numberOfDiscardedResults = numberOfDiscardedResults;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup<ContrastTestParametersActionForm>({
      actionName: new FormControl(this.name),
      maxAllowedError: new FormControl<number | null | undefined>(undefined, [Validators.required]),
      meterPulses: new FormControl<number | null | undefined>(undefined, [Validators.required]),
      numberOfDiscardedResults: new FormControl(this.numberOfDiscardedResults),
    }, []);

    return this.form;
  }
}
