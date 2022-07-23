import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject, takeUntil, tap, BehaviorSubject } from "rxjs";
import { CompileParams } from "../configuration.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class StandIdentificationAction implements Action {

  name = 'Identificación de puestos';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.StandIdentification;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  readonly hiddenFields: Record<string, boolean> = {
    serialNumber: false,
    yearOfProduction: false,
  };

  get standArray(): FormArray<FormGroup> {
    return (this.form.get('stands') as FormArray);
  }

  constructor(destroyed$: ReplaySubject<boolean>) {
    this.destroyed$ = destroyed$;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      stands: new FormArray<FormGroup>([]),
    });
    for (let i = 0; i < CompileParams.STANDS_LENGTH; i++) {      
      const standGroup = new FormGroup({
        isActive: new FormControl(),
        meterId: new FormControl(),
        serialNumber: new FormControl(),
        yearOfProduction: new FormControl(),
      });

      standGroup.get('isActive')?.valueChanges.pipe(
        takeUntil(this.destroyed$),
        tap((isActive) => {
          if(isActive) {
            standGroup.get('meterId')?.setValidators(Validators.required);
            standGroup.get('serialNumber')?.setValidators(Validators.required);
            standGroup.get('yearOfProduction')?.setValidators(Validators.required);
            standGroup.get('meterId')?.enable();
            standGroup.get('serialNumber')?.enable();
            standGroup.get('yearOfProduction')?.enable();
          } else {
            standGroup.get('meterId')?.disable();
            standGroup.get('serialNumber')?.disable();
            standGroup.get('yearOfProduction')?.disable();
            standGroup.get('meterId')?.setValidators(null);
            standGroup.get('serialNumber')?.setValidators(null);
            standGroup.get('yearOfProduction')?.setValidators(null);
            standGroup.get('meterId')?.reset();
            standGroup.get('serialNumber')?.reset();
            standGroup.get('yearOfProduction')?.reset();
          }
        }),
      ).subscribe();
      this.standArray.push(standGroup);
    }

    return this.form;
  }
}
