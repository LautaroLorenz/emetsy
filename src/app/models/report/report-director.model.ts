import { StepBuilder } from "../steps/step-builder.model";
import { ReportHeaderBuilder } from "./report-header.model";
import { Report, ReportPageA4, ReportTable } from "./report.model";

export class ReportEssayDirector {
  private steps!: StepBuilder[];
  private name!: string;

  public setSteps(steps: StepBuilder[]): void {
    this.steps = steps;
  }

  public setName(name: string): void {
    this.name = name;
  }

  /*
  * TODO:
  * - un único ensayo por página
  * - número de página
  * - identificación del reporte (puede ser el id de ejecución)
  */
  public createReport(): Report {
    const report: Report = new Report();

    const pageA4 = new ReportPageA4();
    const reportHeaderBuilder = new ReportHeaderBuilder();
    if (this.name) {
      reportHeaderBuilder.patchValue({ name: this.name })
    } else {
      throw new Error('Reporte sin nombre');
    }
    const header = reportHeaderBuilder.produce();
    pageA4.add(header);
    this.steps.forEach(({ reportBuilder }) => {
      const stepReportTable: ReportTable = reportBuilder.produce();
      pageA4.add(stepReportTable);
    });
    report.pages.push(pageA4);

    return report;
  }
}