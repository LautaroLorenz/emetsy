import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class PhotocellAdjustmentValuesAction implements Action {

  name = 'Valores para ajuste de fotocélula';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.PhotocellAdjustmentValues;
  private readonly anglePhi = 0;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      phaseL1: new FormGroup({
        voltageU1: new FormControl(undefined, [Validators.required]),
        currentI1: new FormControl(undefined, [Validators.required]),
        anglePhi1: new FormControl(this.anglePhi),
      }),
      phaseL2: new FormGroup({
        voltageU2: new FormControl(undefined, [Validators.required]),
        currentI2: new FormControl(undefined, [Validators.required]),
        anglePhi2: new FormControl(this.anglePhi),
      }),
      phaseL3: new FormGroup({
        voltageU3: new FormControl(undefined, [Validators.required]),
        currentI3: new FormControl(undefined, [Validators.required]),
        anglePhi3: new FormControl(this.anglePhi),
      }),
    });

    return this.form;
  }

  getPhase(phaseName: 'L1' | 'L2' | 'L3') {
    return this.form.get(`phase${phaseName}`)?.value;
  }
}
