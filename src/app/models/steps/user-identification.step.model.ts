import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { UserIdentificationAction } from "../actions/user-identification.action.model";
import { ReportUserIdentificationBuilder } from "../report/report-user-identification.model";

export class UserIdentificationStep extends StepBuilder {

  constructor(
    essayTemplateStep: EssayTemplateStep
  ) {
    const reportBuilder = new ReportUserIdentificationBuilder();
    const userIdentificationAction = new UserIdentificationAction();

    const _actions: Action[] = [
      userIdentificationAction,
    ];

    const _buildActions: Action[] = [
    ];

    super(essayTemplateStep, _actions, _buildActions, reportBuilder);
  }

}
