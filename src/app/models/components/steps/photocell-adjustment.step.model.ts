import { EssayTemplateStep } from "../../database/tables/essay-template-step.model";
import { Action } from "../actions/action.model";
import { PhotocellAdjustmentValuesAction } from "../actions/photocell-adjustment-values.action.model";
import { StepBuilder } from "./step-builder.model";

export class PhotocellAdjustmentStep extends StepBuilder {

  constructor(essayTemplateStep: EssayTemplateStep) {
    const photocellAdjustmentValuesAction = new PhotocellAdjustmentValuesAction();

    const _actions: Action[] = [
      photocellAdjustmentValuesAction,
    ];
    
    const _buildActions: Action[] = [
      photocellAdjustmentValuesAction,
    ];

    super(essayTemplateStep, _actions, _buildActions);
  }

}
