import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { filter, Observable, ReplaySubject, takeUntil, tap } from "rxjs";
import { Action, ExecutionStatus } from "../actions/action.model";


@Component({
  template: ``
})
export class StepComponentClass {

  form: FormGroup;
  actions!: Action[];
  actionsToRender!: Action[];

  @Input() isBuildMode: boolean = false;
  @Input() actionsRawData: any[] = [];
  @Output() actionsRawDataChange = new EventEmitter<any[]>();

  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  private get formActionsArray(): FormArray<FormGroup> {
    return this.form.get('actions') as FormArray<FormGroup>;
  }

  constructor() {
    this.form = new FormGroup({
      actions: new FormArray([])
    });
  }

  buildStepForm(actions: Action[]): void {
    actions.forEach((action) => {
      this.formActionsArray.push(action.buildForm());
    });
  }

  formValueChanges(): Observable<any[]> {
    return this.form.valueChanges.pipe(
      takeUntil(this.destroyed$),
      filter(() => JSON.stringify(this.actionsRawData) !== JSON.stringify(this.form.getRawValue())),
      tap(() => this.actionsRawDataChange.emit(this.form.getRawValue())), // raw value to include disabled
    );
  }

  filterActionsByExecutionStatus(actions: Action[], executionsStatus: ExecutionStatus[]): Action[] {
    return actions.filter(({ executionStatus$ }) => executionsStatus.includes(executionStatus$.value));
  }
}
