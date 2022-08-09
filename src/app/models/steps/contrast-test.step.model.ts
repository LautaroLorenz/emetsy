import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { ContrastTestParametersAction } from "../actions/contrast-test-parameters.action.model";
import { EnterTestValuesAction } from "../actions/enter-test-values.action.model";
import { ContrastTestExecutionAction } from "../actions/contrast-test-execution.action.model";
import { ReportContrastTestBuilder } from "../report/report-contrast-test.model";

export class ContrastTestStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep) {
    const reportBuilder = new ReportContrastTestBuilder();
    const enterTestValuesAction = new EnterTestValuesAction(0);
    const contrastTestParametersAction = new ContrastTestParametersAction(3);
    const contrastTestExecutionAction = new ContrastTestExecutionAction(enterTestValuesAction, contrastTestParametersAction);

    const _actions: Action[] = [
      enterTestValuesAction,
      contrastTestParametersAction,
      contrastTestExecutionAction,
    ];
    
    const _buildActions: Action[] = [
      enterTestValuesAction,
      contrastTestParametersAction,
    ];

    super(essayTemplateStep, _actions, _buildActions, reportBuilder);
  }

}
