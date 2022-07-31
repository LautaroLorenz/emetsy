import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { StepBuilder } from "./step-builder.model";
import { PhotocellAdjustmentValuesAction } from "../actions/photocell-adjustment-values.action.model";
import { PhotocellAdjustmentExecutionAction } from "../actions/photocell-adjustment-execution.action.model";

export class PhotocellAdjustmentStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep) {
    const photocellAdjustmentValuesAction = new PhotocellAdjustmentValuesAction();
    const photocellAdjustmentExecutionAction = new PhotocellAdjustmentExecutionAction(photocellAdjustmentValuesAction);

    const _actions: Action[] = [
      photocellAdjustmentValuesAction,
      photocellAdjustmentExecutionAction,
    ];
    
    const _buildActions: Action[] = [
      photocellAdjustmentValuesAction,
    ];

    super(essayTemplateStep, _actions, _buildActions);
  }

}
