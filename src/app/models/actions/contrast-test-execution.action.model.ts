import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";
import { ContrastTestParametersAction } from "./contrast-test-parameters.action.model";
import { EnterTestValuesAction } from "./enter-test-values.action.model";
import { StandIdentificationAction } from "./stand-identification.action.model";

export class ContrastTestExecutionAction implements Action {

  name = 'Realizar prueba de contraste';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.ContrastTestExecution;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  readonly standIdentificationAction: StandIdentificationAction;
  readonly enterTestValuesAction: EnterTestValuesAction;
  readonly contrastTestParametersAction: ContrastTestParametersAction;

  constructor(
    standIdentificationAction: StandIdentificationAction,
    enterTestValuesAction: EnterTestValuesAction,
    contrastTestParametersAction: ContrastTestParametersAction,
  ) {
    this.standIdentificationAction = standIdentificationAction;
    this.enterTestValuesAction = enterTestValuesAction;
    this.contrastTestParametersAction = contrastTestParametersAction;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      contrastTestExecutionComplete: new FormControl(undefined, [Validators.required]),
    });

    return this.form;
  }
}
