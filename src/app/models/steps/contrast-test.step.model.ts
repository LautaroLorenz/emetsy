import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { ContrastTestParametersAction } from "../actions/contrast-test-parameters.action.model";
import { EnterTestValuesAction } from "../actions/enter-test-values.action.model";
import { ContrastTestExecutionAction } from "../actions/contrast-test-execution.action.model";
import { ReportContrastTestBuilder } from "../report/report-contrast-test.model";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { StandIdentificationAction } from "../actions/stand-identification.action.model";
import { ReplaySubject } from "rxjs";

export class ContrastTestStep extends StepBuilder {

  constructor(
    essayTemplateStep: EssayTemplateStep,
    destroyed$: ReplaySubject<boolean>
  ) {
    const reportBuilder = new ReportContrastTestBuilder();
    const standIdentificationAction = new StandIdentificationAction(destroyed$);
    const enterTestValuesAction = new EnterTestValuesAction(0);
    const contrastTestParametersAction = new ContrastTestParametersAction(3);
    const contrastTestExecutionAction = new ContrastTestExecutionAction(enterTestValuesAction, contrastTestParametersAction);

    const _actions: Action[] = [
      standIdentificationAction,
      enterTestValuesAction,
      contrastTestParametersAction,
      contrastTestExecutionAction,
    ];

    const _buildActions: Action[] = [
      standIdentificationAction,
      enterTestValuesAction,
      contrastTestParametersAction,
    ];

    super(essayTemplateStep, _actions, _buildActions, reportBuilder);
  }

}
