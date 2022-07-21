import { ReplaySubject } from "rxjs";
import { EssayTemplateStep } from "../../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { StandIdentificationAction } from "../actions/stand-identification.action.model";
import { UserIdentificationAction } from "../actions/user-identification.action.model";
import { StepBuilder } from "./step-builder.model";

export class PreparationStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep, destroyed$: ReplaySubject<boolean>) {
    const userIdentificationAction = new UserIdentificationAction();
    const standIdentificationAction = new StandIdentificationAction(destroyed$);

    const _actions: Action[] = [
      userIdentificationAction,
      standIdentificationAction,
    ];
    
    const _buildActions: Action[] = [
      standIdentificationAction,
    ];

    super(essayTemplateStep, _actions, _buildActions);
  }

}
