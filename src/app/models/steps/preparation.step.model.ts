import { ReplaySubject } from "rxjs";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { UserIdentificationAction } from "../actions/user-identification.action.model";
import { StandIdentificationAction } from "../actions/stand-identification.action.model";
import { StandIdentificationMinimalFieldsDecorator } from "../actions/meter-identification.action.model";

export class PreparationStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep, destroyed$: ReplaySubject<boolean>) {
    const userIdentificationAction = new UserIdentificationAction();
    const standIdentificationAction = new StandIdentificationAction(destroyed$);
    const standIdentificationMinimalFieldsDecorator = new StandIdentificationMinimalFieldsDecorator(standIdentificationAction);

    const _actions: Action[] = [
      userIdentificationAction,
      standIdentificationAction,
    ];
    
    const _buildActions: Action[] = [
      standIdentificationMinimalFieldsDecorator,
    ];

    super(essayTemplateStep, _actions, _buildActions);
  }

}
