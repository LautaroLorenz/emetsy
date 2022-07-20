import { FormControl, FormGroup } from "@angular/forms";
import { Action, ActionEnum } from "./action.model";

export class PhotocellAdjustmentValuesAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.PhotocellAdjustmentValues;
  private readonly anglePhi = 0;

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      phaseL1: new FormGroup({
        voltageU1: new FormControl(),
        currentI1: new FormControl(),
        anglePhi1: new FormControl(this.anglePhi),
      }),
      phaseL2: new FormGroup({
        voltageU2: new FormControl(),
        currentI2: new FormControl(),
        anglePhi2: new FormControl(this.anglePhi),
      }),
      phaseL3: new FormGroup({
        voltageU3: new FormControl(),
        currentI3: new FormControl(),
        anglePhi3: new FormControl(this.anglePhi),
      }),
    });

    return this.form;
  }
}
