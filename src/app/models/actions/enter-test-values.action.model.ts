import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Phases } from "../components/phase.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class EnterTestValuesAction implements Action {
  
  name = 'Valores generales de la prueba';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.EnterTestValues;
  meterConstant: number;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  constructor(meterConstant: number) { 
    this.meterConstant = meterConstant;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      meterConstant: new FormControl(this.meterConstant),
      phaseL1: new FormGroup({
        voltageU1: new FormControl(undefined, [Validators.required]),
        currentI1: new FormControl(undefined, [Validators.required]),
        anglePhi1: new FormControl(undefined, [Validators.required]),
      }),
      phaseL2: new FormGroup({
        voltageU2: new FormControl(undefined, [Validators.required]),
        currentI2: new FormControl(undefined, [Validators.required]),
        anglePhi2: new FormControl(undefined, [Validators.required]),
      }),
      phaseL3: new FormGroup({
        voltageU3: new FormControl(undefined, [Validators.required]),
        currentI3: new FormControl(undefined, [Validators.required]),
        anglePhi3: new FormControl(undefined, [Validators.required]),
      }),
    });
    
    return this.form;
  }

  getPhases(): Phases {
    return {
      phaseL1: this.form.get('phaseL1')?.value,
      phaseL2: this.form.get('phaseL2')?.value,
      phaseL3: this.form.get('phaseL3')?.value,
    };
  }
}
