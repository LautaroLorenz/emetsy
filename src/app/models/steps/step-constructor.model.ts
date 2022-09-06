import { ReplaySubject } from "rxjs";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { ReportBuilder } from "../report/report-builder.model";
import { ContrastTestStep } from "./contrast-test.step.model";
import { PhotocellAdjustmentStep } from "./photocell-adjustment.step.model";
import { PreparationStep } from "./preparation.step.model";
import { ReportStep } from "./report.step.model";
import { StepBuilder } from "./step-builder.model";
import { UserIdentificationStep } from "./user-identification.step.model";

export enum StepIdEnum {
  ReportBuilder = 0, // default
  ReportStep = 1,
  _2 = 2,
  _3 = 3,
  ContrastTestStep = 4,
  _5 = 5,
  PhotocellAdjustmentStep = 6,
  PreparationStep = 7,
  UserIdentificationStep = 8,
}
export type StepId = StepIdEnum;

export class StepConstructor {
  static buildStepById(step_id: StepId, essayTemplateStep: EssayTemplateStep, destroyed$: ReplaySubject<boolean>): StepBuilder {
    switch (step_id) {
      case StepIdEnum.ReportStep:
        return new ReportStep(essayTemplateStep);
      case StepIdEnum.ContrastTestStep:
        return new ContrastTestStep(essayTemplateStep);
      case StepIdEnum.PhotocellAdjustmentStep:
        return new PhotocellAdjustmentStep(essayTemplateStep);
      case StepIdEnum.PreparationStep:
        return new PreparationStep(essayTemplateStep, destroyed$);
      case StepIdEnum.UserIdentificationStep:
        return new UserIdentificationStep(essayTemplateStep);
    }

    return new StepBuilder(essayTemplateStep, [], [], new ReportBuilder());
  }
}