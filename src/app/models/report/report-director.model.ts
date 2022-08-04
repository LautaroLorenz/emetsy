import { StepBuilder } from "../steps/step-builder.model";
import { Report } from "./report.model";

export class ReportEssayDirector {
  private steps!: StepBuilder[];

  public setSteps(steps: StepBuilder[]): void {
    this.steps = steps;
  }

  public createReport(): Report {
    const report: Report = { html: '' };

    this.steps.forEach(({ reportBuilder }) => {
      const stepReport = reportBuilder.produce();
      console.log(stepReport);
    });

    return report;
  }
}