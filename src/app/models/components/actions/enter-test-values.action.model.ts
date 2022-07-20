import { FormControl, FormGroup } from "@angular/forms";
import { Action, ActionEnum } from "./action.model";

export class EnterTestValuesAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.EnterTestValues;
  testName: string;
  meterConstant: number;

  constructor(testName: string, meterConstant: number) { 
    this.testName = testName;
    this.meterConstant = meterConstant;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      testName: new FormControl(this.testName),
      meterConstant: new FormControl(this.meterConstant),
      phaseL1: new FormGroup({
        voltageU1: new FormControl(),
        currentI1: new FormControl(),
        anglePhi1: new FormControl(),
      }),
      phaseL2: new FormGroup({
        voltageU2: new FormControl(),
        currentI2: new FormControl(),
        anglePhi2: new FormControl(),
      }),
      phaseL3: new FormGroup({
        voltageU3: new FormControl(),
        currentI3: new FormControl(),
        anglePhi3: new FormControl(),
      }),
    });
    
    return this.form;
  }
}
