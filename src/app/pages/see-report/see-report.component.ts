import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { History, HistoryDbTableContext, PageUrlName, Report, ReportEssayDirector, StepBuilder, StepConstructor } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { NavigationService } from 'src/app/services/navigation.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  templateUrl: './see-report.component.html',
  styleUrls: ['./see-report.component.scss']
})
export class SeeReportComponent implements OnInit, OnDestroy {

  @ViewChild('container', { static: false }) container!: ElementRef;
  history$: BehaviorSubject<History | null> = new BehaviorSubject<History | null>(null);
  readonly title: string = 'Detalle de ejecución';
  readonly id$: Observable<number>;

  private _preview: string = '';
  private _report!: Report;

  get preview(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this._preview);
  }
  get disabled(): boolean {
    return this.creating$.value || !this._preview;
  }

  private readonly creating$ = new BehaviorSubject<boolean>(false);
  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly navigationService: NavigationService,
    private readonly dbServiceHistory: DatabaseService<History>,
    private readonly sanitizer: DomSanitizer
  ) {
    this.id$ = this.route.queryParams.pipe(
      filter(({ id }) => id),
      map(({ id }) => id),
    );
  }

  ngOnInit(): void {
    this.id$.pipe(
      takeUntil(this.destroyed$),
      switchMap((id) => this.dbServiceHistory.getTableElement$(HistoryDbTableContext.tableName, id)),
      tap((history) => history.items_raw = JSON.parse(history.items_raw as unknown as string)), // parse raw data
      tap((history) => this.history$.next(history)),
      tap((history) => {
        const reportDirector = new ReportEssayDirector(history, this.destroyed$);
        const report: Report = reportDirector.createReport();
        this._report = report;
        this._preview = report.toString();
      }),
    ).subscribe();
  }

  exit() {
    this.navigationService.back({ targetPage: PageUrlName.historyAndReports });
  };

  async createPDF(history: History) {
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
    await PDF.save(`${history.essay} - ${history.saved} Hs.pdf`);
    this.creating$.next(false);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
