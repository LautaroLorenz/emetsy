import { EssayTemplateStep } from "../../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { ContrastTestParametersAction } from "../actions/contrast-test-parameters.action.model";
import { EnterTestValuesAction } from "../actions/enter-test-values.action.model";
import { StepBuilder } from "./step-builder.model";

export class ContrastTestStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep) {
    const enterTestValuesAction = new EnterTestValuesAction('Prueba de constraste', 0);
    const contrastTestParametersAction = new ContrastTestParametersAction(3);

    const _actions: Action[] = [
      enterTestValuesAction,
      contrastTestParametersAction,
    ];
    
    const _buildActions: Action[] = [
      enterTestValuesAction,
      contrastTestParametersAction,
    ];

    super(essayTemplateStep, _actions, _buildActions);
  }

}
