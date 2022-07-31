import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";
import { PhotocellAdjustmentValuesAction } from "./photocell-adjustment-values.action.model";

export class PhotocellAdjustmentExecutionAction implements Action {

  name = 'Realizar ajuste de fotocélula';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.PhotocellAdjustmentExecution;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  readonly photocellAdjustmentValuesAction: PhotocellAdjustmentValuesAction;

  constructor(
    photocellAdjustmentValuesAction: PhotocellAdjustmentValuesAction
  ) {
    this.photocellAdjustmentValuesAction = photocellAdjustmentValuesAction;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      photocellAdjustmentExecutionComplete: new FormControl(undefined, [Validators.required]),
    });

    return this.form;
  }
}
