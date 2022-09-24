import { ReplaySubject } from "rxjs";
import { History, HistoryItem } from "../database/tables/history.model";
import { StepBuilder } from "../steps/step-builder.model";
import { StepConstructor } from "../steps/step-constructor.model";
import { ReportHeaderBuilder } from "./report-header.model";
import { Report, ReportPageA4, ReportTable } from "./report.model";

export class ReportEssayDirector {
  private history: History;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1)

  constructor(
    history: History,
    destroyed$: ReplaySubject<boolean>,
  ) {
    this.history = history;
    this.destroyed$ = destroyed$;
  }

  private mapHistoyItemsToStepBuilders(items_raw: HistoryItem[], destroyed$: ReplaySubject<boolean>): StepBuilder[] {
    const stepBuilders: StepBuilder[] = items_raw.map(({ essayTemplateStep }) => StepConstructor.buildStepById(essayTemplateStep.step_id, essayTemplateStep, destroyed$));
    stepBuilders.forEach(({ reportBuilder }, index) => reportBuilder.patchValue(items_raw[index].reportData));
    return stepBuilders;
  }

  private addHeaderToPages(pages: ReportPageA4[]): void {
    const reportHeaderBuilder = new ReportHeaderBuilder();
    if (this.history.essay) {
      reportHeaderBuilder.patchValue({
        name: this.history.essay,
        reportNumber: this.history.id,
      });
    } else {
      throw new Error('Reporte sin nombre');
    }
    let pageNumber: number = 1;
    pages.forEach((page) => {
      reportHeaderBuilder.patchValue({
        page: {
          total: pages.length,
          number: pageNumber++,
        }
      });
      const header = reportHeaderBuilder.produce();
      page.addHeader(header);
    });
  }

  public createReport(): Report {
    const report: Report = new Report();

    const pages: ReportPageA4[] = [];
    const stepBuilders = this.mapHistoyItemsToStepBuilders(this.history.items_raw, this.destroyed$);
    let currentPageIndex = 0;
    stepBuilders.forEach(({ reportBuilder }, index) => {
      if (index === stepBuilders.length - 1) {
        return; // break report step
      }
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