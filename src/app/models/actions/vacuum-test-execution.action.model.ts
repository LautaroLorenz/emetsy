import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";
import { EnterTestValuesAction } from "./enter-test-values.action.model";
import { StandIdentificationAction } from "./stand-identification.action.model";
import { VacuumTestParametersAction } from "./vacuum-test-parameters.action.model";

export class VacuumTestExecutionAction implements Action {

  name = 'Realizar prueba de vacío';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.VacuumTestExecution;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  readonly standIdentificationAction: StandIdentificationAction;
  readonly enterTestValuesAction: EnterTestValuesAction;
  readonly vacuumTestParametersAction: VacuumTestParametersAction;

  constructor(
    standIdentificationAction: StandIdentificationAction,
    enterTestValuesAction: EnterTestValuesAction,
    vacuumTestParametersAction: VacuumTestParametersAction,
  ) {
    this.standIdentificationAction = standIdentificationAction;
    this.enterTestValuesAction = enterTestValuesAction;
    this.vacuumTestParametersAction = vacuumTestParametersAction;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      executionComplete: new FormControl(undefined, [Validators.required]),
    });

    return this.form;
  }
}
