import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { Action, ActionEnum, ExecutionStatus } from "./action.model";


export class ReportAction implements Action {

  name = 'Generación de reporte';
  form!: FormGroup;
  actionEnum: ActionEnum = ActionEnum.Report;
  executionStatus$ = new BehaviorSubject<ExecutionStatus>('CREATED');

  constructor() { }

  buildForm(): FormGroup {
    this.form = new FormGroup({
      actionName: new FormControl(this.name),
      viewed: new FormControl<boolean | undefined>(undefined, [Validators.required]),
    });

    return this.form;
  }

}
