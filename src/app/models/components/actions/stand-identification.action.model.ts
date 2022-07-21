import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ReplaySubject, takeUntil, tap, BehaviorSubject } from "rxjs";
import { standIdentificationValidator } from "src/app/validators";
import { CompileParams } from "../../configuration.model";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";

export class StandIdentificationAction implements Action {

  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.StandIdentification;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('PENDING');

  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  get standArray(): FormArray<FormGroup> {
    return (this.form.get('stands') as FormArray);
  }

  constructor(destroyed$: ReplaySubject<boolean>) {
    this.destroyed$ = destroyed$;
  }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      stands: new FormArray<FormGroup>([], standIdentificationValidator())
    });
    for (let i = 0; i < CompileParams.STANDS_LENGTH; i++) {
      const standGroup = new FormGroup({
        isActive: new FormControl(),
        meterId: new FormControl(),
      });
      standGroup.get('isActive')?.valueChanges.pipe(
        takeUntil(this.destroyed$),
        tap((isActive) => {
          isActive ? standGroup.get('meterId')?.enable() : standGroup.get('meterId')?.disable();
          !isActive && standGroup.get('meterId')?.reset()
        })
      ).subscribe();
      this.standArray.push(standGroup);
    }

    return this.form;
  }
}
