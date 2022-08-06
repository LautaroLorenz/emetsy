import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { ReportAction } from "../actions/report.action.model";
import { ReportBuilder } from "../report/report-builder.model";
import { ReportContrastTestBuilder } from "../report/report-contrast-test.model";

export class ReportStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep) {
    const reportBuilder = new ReportContrastTestBuilder(); // TODO: cambiar
    const reportAction = new ReportAction();

    const _actions: Action[] = [
      reportAction,
    ];

    const _buildActions: Action[] = [];

    super(essayTemplateStep, _actions, _buildActions, reportBuilder);
  }

}