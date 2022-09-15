import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject, takeUntil, tap, BehaviorSubject } from "rxjs";
import { CompileParams } from "../compile-params.model";
import { StandArrayForm } from "../forms/stand-identification-action.form.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class StandIdentificationAction implements Action {

  name = 'Identificación de puestos';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.StandIdentification;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');
  readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  get standArray(): FormArray<FormGroup<StandArrayForm>> {
    return (this.form.get('stands') as FormArray<FormGroup<StandArrayForm>>);
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
      const standGroup = new FormGroup<StandArrayForm>({
        standIndex: new FormControl<number | null | undefined>(i + 1),
        isActive: new FormControl<boolean | null | undefined>(true),
        meterId: new FormControl<number | null | undefined>(undefined),
        serialNumber: new FormControl<string | null | undefined>(undefined),
        yearOfProduction: new FormControl<number | null | undefined>(undefined),
      });
      standGroup.get('isActive')?.valueChanges.pipe(
        takeUntil(this.destroyed$),
        tap((isActive) => {
          if (isActive) {
            standGroup.get('meterId')?.setValidators(Validators.required);
            standGroup.get('meterId')?.enable();
            standGroup.get('serialNumber')?.setValidators(Validators.required);
            standGroup.get('serialNumber')?.enable();
            standGroup.get('yearOfProduction')?.setValidators(Validators.required);
            standGroup.get('yearOfProduction')?.enable();
          } else {
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
        }),
      ).subscribe();
      this.standArray.push(standGroup);
    }

    return this.form;
  }
}
