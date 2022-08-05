import { FormArray, FormGroup } from "@angular/forms";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { ReportBodyBuilder } from "../report/report-builder.model";

export class StepBuilder {
  essayTemplateStep: EssayTemplateStep;
  form: FormGroup;
  actions: Action[];
  buildActions: Action[];
  reportBuilder: ReportBodyBuilder;

  private get formActionsArray(): FormArray<FormGroup> {
    return this.form.get('actions') as FormArray<FormGroup>;
  }

  constructor(
    essayTemplateStep: EssayTemplateStep,
    actions: Action[],
    buildActions: Action[],
    reportBuilder: ReportBodyBuilder,
  ) {
    this.essayTemplateStep = essayTemplateStep;
    this.actions = actions;
    this.buildActions = buildActions;
    this.reportBuilder = reportBuilder;
    this.form = new FormGroup({
      actions: new FormArray([])
    });
  }

  buildStepForm(): void {
    this.actions.forEach((action) => {
      this.formActionsArray.push(action.buildForm());
    });
  }
}
