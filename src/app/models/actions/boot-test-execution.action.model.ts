import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";
import { BootTestParametersAction } from "./boot-test-parameters.action.model";
import { EnterTestValuesAction } from "./enter-test-values.action.model";
import { StandIdentificationAction } from "./stand-identification.action.model";

export class BootTestExecutionAction implements Action {

  name = 'Realizar prueba de arranque';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.BootTestExecution;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  readonly standIdentificationAction: StandIdentificationAction;
  readonly enterTestValuesAction: EnterTestValuesAction;
  readonly bootTestParametersAction: BootTestParametersAction;

  constructor(
    standIdentificationAction: StandIdentificationAction,
    enterTestValuesAction: EnterTestValuesAction,
    bootTestParametersAction: BootTestParametersAction,
  ) {
    this.standIdentificationAction = standIdentificationAction;
    this.enterTestValuesAction = enterTestValuesAction;
    this.bootTestParametersAction = bootTestParametersAction;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      executionComplete: new FormControl(undefined, [Validators.required]),
    });

    return this.form;
  }
}