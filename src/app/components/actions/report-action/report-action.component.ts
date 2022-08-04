import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent, Report } from 'src/app/models';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { jsPDF } from 'jspdf';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-report-action',
  templateUrl: './report-action.component.html',
  styleUrls: ['./report-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportActionComponent implements ActionComponent {

  @Input() action!: Action;
  private _preview: string = '';

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

  readonly creating$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly executionDirector: ExecutionDirector,
    private readonly sanitizer: DomSanitizer
  ) {
    const report: Report = this.executionDirector.reportEssayDirector.createReport();
    this._preview = report.html;
  }

  private async savePDF(html: string, name: string): Promise<jsPDF> {
    const doc = new jsPDF('p', 'mm', "a4");
    await doc.html(html);
    return await doc.save(name);
  }

  async createPDF(): Promise<void> {
    this.creating$.next(true);
    await this.savePDF(this._preview, 'report.pdf'); // TODO: essay name - ejecution ID
    this.creating$.next(false);
  }

}
