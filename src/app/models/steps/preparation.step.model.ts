import { ReplaySubject } from "rxjs";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { UserIdentificationAction } from "../actions/user-identification.action.model";
import { StandIdentificationAction } from "../actions/stand-identification.action.model";
import { StandIdentificationMinimalFieldsDecorator } from "../actions/meter-identification.action.model";
import { ReportBuilder } from "../report/report-builder.model";

export class PreparationStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep, destroyed$: ReplaySubject<boolean>) {
    const reportBuilder = new ReportBuilder();
    const userIdentificationAction = new UserIdentificationAction();
    const standIdentificationAction = new StandIdentificationAction(destroyed$);
    const standIdentificationMinimalFieldsDecorator = new StandIdentificationMinimalFieldsDecorator(standIdentificationAction);

    const _actions: Action[] = [
      // userIdentificationAction, // TODO: descomentar
      standIdentificationAction,
    ];
    
    const _buildActions: Action[] = [
      standIdentificationMinimalFieldsDecorator,
    ];

    super(essayTemplateStep, _actions, _buildActions, reportBuilder);
  }

}
