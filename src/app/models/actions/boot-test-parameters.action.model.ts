import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { BootTestParametersActionForm } from "../forms/boot-test-parameters-action.form.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class BootTestParametersAction implements Action {

  name = 'Parámetros para la prueba de arranque';
  form!: FormGroup<BootTestParametersActionForm>;
  actionEnum: ActionEnum = ActionEnum.BootTestParameters;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup<BootTestParametersActionForm>({
      actionName: new FormControl(this.name),
      allowedPulses: new FormControl<number | null | undefined>(undefined, [Validators.required]),
      minDurationSeconds: new FormControl<number | null | undefined>(undefined, [Validators.required]),
      maxDurationSeconds: new FormControl<number | null | undefined>(undefined, [Validators.required]),
    }, []);

    return this.form;
  }
}
