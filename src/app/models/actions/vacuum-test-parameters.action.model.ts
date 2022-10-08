import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { VacuumTestParametersActionForm } from "../forms/vacuum-test-parameters-action.form.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class VacuumTestParametersAction implements Action {

  name = 'Parámetros para la prueba de vacío';
  form!: FormGroup<VacuumTestParametersActionForm>;
  actionEnum: ActionEnum = ActionEnum.VacuumTestParameters;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  constructor() {}

  buildForm(): FormGroup {
    this.form = new FormGroup<VacuumTestParametersActionForm>({
      actionName: new FormControl(this.name),
      maxAllowedPulses: new FormControl<number | null | undefined>(undefined, [Validators.required]),
      durationSeconds: new FormControl<number | null | undefined>(undefined, [Validators.required]),
    }, []);

    return this.form;
  }
}
