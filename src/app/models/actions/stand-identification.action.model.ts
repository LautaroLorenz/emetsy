import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject, takeUntil, tap, BehaviorSubject } from "rxjs";
import { CompileParams } from "../compile-params.model";
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
    hasManufacturingInformation: true,
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
      hasManufacturingInformation: new FormControl(true, [Validators.required]),
      stands: new FormArray<FormGroup>([]),
    });
    this.form.get('hasManufacturingInformation')?.valueChanges.pipe(
      takeUntil(this.destroyed$),
      tap(() => {
        this.standArray.controls.forEach((control) => control.get('meterId')?.setValue(undefined));
      }),
    ).subscribe();
    for (let i = 0; i < CompileParams.STANDS_LENGTH; i++) {
      const standGroup = new FormGroup({
        isActive: new FormControl(true),
        meterId: new FormControl(),
        serialNumber: new FormControl(),
        yearOfProduction: new FormControl(),
      });
      standGroup.get('isActive')?.valueChanges.pipe(
        takeUntil(this.destroyed$),
        tap((isActive) => {
          if (isActive) {
            if (this.form.get('hasManufacturingInformation')?.value) {
              standGroup.get('meterId')?.setValidators(Validators.required);
              standGroup.get('meterId')?.enable();
              standGroup.get('serialNumber')?.setValidators(Validators.required);
              standGroup.get('serialNumber')?.enable();
              standGroup.get('yearOfProduction')?.setValidators(Validators.required);
              standGroup.get('yearOfProduction')?.enable();
            }
          } else {
            if (this.form.get('hasManufacturingInformation')?.value) {
              standGroup.get('meterId')?.disable();
              standGroup.get('meterId')?.setValidators(null);
              standGroup.get('meterId')?.reset();
              standGroup.get('serialNumber')?.disable();
              standGroup.get('serialNumber')?.setValidators(null);
              standGroup.get('serialNumber')?.reset();
              standGroup.get('yearOfProduction')?.disable();
              standGroup.get('yearOfProduction')?.setValidators(null);
              standGroup.get('yearOfProduction')?.reset();
            }
          }
        }),
      ).subscribe();
      this.standArray.push(standGroup);
    }

    return this.form;
  }
}
