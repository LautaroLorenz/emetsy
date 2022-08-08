import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent, Report } from 'src/app/models';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-report-action',
  templateUrl: './report-action.component.html',
  styleUrls: ['./report-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportActionComponent implements ActionComponent, OnInit, AfterViewInit {

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

  constructor(
    private readonly executionDirector: ExecutionDirector,
    private readonly sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    const report: Report = this.executionDirector.reportEssayDirector.createReport();
    this._report = report;
    this._preview = report.toString();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.get('viewed')?.setValue(true);
    }, 500);
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

}
