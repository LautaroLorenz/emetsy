import { ReplaySubject } from "rxjs";
import { EssayTemplateStep } from "../database/tables/essay-template-step.model";
import { ReportBuilder } from "../report/report-builder.model";
import { BootTestStep } from "./boot-test.step.model";
import { ContrastTestStep } from "./contrast-test.step.model";
import { PhotocellAdjustmentStep } from "./photocell-adjustment.step.model";
import { ReportStep } from "./report.step.model";
import { StepBuilder } from "./step-builder.model";
import { UserIdentificationStep } from "./user-identification.step.model";
import { VacuumTestStep } from "./vacuum-test.step.model";

export enum StepIdEnum {
  ReportBuilder = 0, // default
  ReportStep = 1,
  VacuumTestStep = 2,
  _3 = 3,
  ContrastTestStep = 4,
  BootTestStep = 5,
  PhotocellAdjustmentStep = 6,
  UserIdentificationStep = 7,
}
export type StepId = StepIdEnum;

export class StepConstructor {
  static buildStepById(step_id: StepId, essayTemplateStep: EssayTemplateStep, destroyed$: ReplaySubject<boolean>): StepBuilder {
    switch (step_id) {
      case StepIdEnum.ReportStep:
        return new ReportStep(essayTemplateStep);
      case StepIdEnum.PhotocellAdjustmentStep:
        return new PhotocellAdjustmentStep(essayTemplateStep);
      case StepIdEnum.UserIdentificationStep:
        return new UserIdentificationStep(essayTemplateStep);
      case StepIdEnum.VacuumTestStep:
        return new VacuumTestStep(essayTemplateStep, destroyed$);
      case StepIdEnum.ContrastTestStep:
        return new ContrastTestStep(essayTemplateStep, destroyed$);
      case StepIdEnum.BootTestStep:
        return new BootTestStep(essayTemplateStep, destroyed$);
    }

    return new StepBuilder(essayTemplateStep, [], [], new ReportBuilder());
  }
}