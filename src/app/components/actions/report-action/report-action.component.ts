import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent, DateHelper, History, HistoryDbTableContext, HistoryItem, Report, ReportEssayDirector } from 'src/app/models';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BehaviorSubject, ReplaySubject, take, tap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-report-action',
  templateUrl: './report-action.component.html',
  styleUrls: ['./report-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportActionComponent implements ActionComponent, OnInit, OnDestroy {

  @ViewChild('container', { static: false }) container!: ElementRef;
  @Input() action!: Action;
  private _preview: string = '';
  private _report!: Report;

  get preview(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this._preview);
  }

  get disabled(): boolean {
    return this.creating$.value || !this._preview;
  }

  get name(): string {
    return this.action.name;
  }

  get form(): FormGroup {
    return this.action.form;
  }

  private readonly creating$ = new BehaviorSubject<boolean>(false);
  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly executionDirector: ExecutionDirector,
    private readonly dbServiceHistory: DatabaseService<History>,
    private readonly sanitizer: DomSanitizer,
    private readonly messagesService: MessagesService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) { }

  private createReportPreview(history: History): void {
    const reportDirector = new ReportEssayDirector(history, this.destroyed$);
    const report: Report = reportDirector.createReport();
    this._report = report;
    this._preview = report.toString();
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    const history: History = {
      essay: this.executionDirector.reportName,
      saved: DateHelper.getNow(),
    } as History;
    history.items_raw = [];
    this.executionDirector.steps.forEach((stepBuilder) => {
      const historyItem: HistoryItem = {
        essayTemplateStep: stepBuilder.essayTemplateStep,
        reportData: stepBuilder.reportBuilder.data
      };
      history.items_raw.push(historyItem);
    });
    this.dbServiceHistory.addElementToTable$(HistoryDbTableContext.tableName, {
      ...history,
      items_raw: JSON.stringify(history.items_raw) as any,
    })
      .pipe(
        take(1),
        tap((id) => {
          history.id = id;
          this.messagesService.success('Reporte agregado al historial', 2000);
          this.form.get('viewed')?.setValue(true);
          this.createReportPreview(history);
        }),
      ).subscribe({
        error: () => this.messagesService.error('No se pudo crear el elemento')
      });

  }

  async createPDF() {
    this.creating$.next(true);
    const PDF = new jsPDF('p', 'mm', 'a4');
    for (const [index] of this._report.pages.entries()) {
      if (index > 0) {
        PDF.addPage();
      }
      const canvas = await html2canvas(this.container.nativeElement.children[index], { scale: 3 });
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const width = PDF.internal.pageSize.getWidth();
      const height = PDF.internal.pageSize.getHeight();
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 0, width, height);
    }
    await PDF.save(`reporte - ${(new Date).getTime()}.pdf`);
    this.creating$.next(false);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
