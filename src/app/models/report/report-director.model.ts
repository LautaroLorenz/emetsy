import { StepBuilder } from "../steps/step-builder.model";
import { ReportHeaderBuilder } from "./report-header.model";
import { Report, ReportPageA4, ReportTable } from "./report.model";

export class ReportEssayDirector {
  private steps!: StepBuilder[];
  private name!: string;

  private addHeaderToPages(pages: ReportPageA4[]): void {
    const reportHeaderBuilder = new ReportHeaderBuilder();
    if (this.name) {
      reportHeaderBuilder.patchValue({ name: this.name })
    } else {
      throw new Error('Reporte sin nombre');
    }
    const header = reportHeaderBuilder.produce();

    pages.forEach((page) => page.addHeader(header));
  }

  public setSteps(steps: StepBuilder[]): void {
    this.steps = steps;
  }

  public setName(name: string): void {
    this.name = name;
  }

  /*
  * TODO:
  * - número de página
  * - identificación del reporte (puede ser el id de ejecución)
  */
  public createReport(): Report {
    const report: Report = new Report();

    const pages: ReportPageA4[] = [];
    let currentPageIndex = 0;
    this.steps.forEach(({ reportBuilder }, index) => {
      if(index === this.steps.length - 1) {
        return; // break report step
      }

      console.log(reportBuilder.requireAnEmptyPage, reportBuilder.constructor.name)
      if (pages[currentPageIndex] === undefined) {
        pages.push((new ReportPageA4()));
      }
      const stepReportTable: ReportTable = reportBuilder.produce();
      pages[currentPageIndex].add(stepReportTable);
      if (reportBuilder.requireAnEmptyPage) {
        currentPageIndex++;
      }
    });

    this.addHeaderToPages(pages);
    pages.forEach((page) => report.pages.push(page));

    return report;
  }
}