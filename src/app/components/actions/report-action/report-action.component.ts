import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent, Report } from 'src/app/models';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { jsPDF } from 'jspdf';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-report-action',
  templateUrl: './report-action.component.html',
  styleUrls: ['./report-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportActionComponent implements ActionComponent {

  @Input() action!: Action;

  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }

  readonly creating$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly executionDirector: ExecutionDirector,
  ) { }

  private async savePDF(html: string, name: string): Promise<jsPDF> {
    let doc = new jsPDF();
    await doc.html(html, { 'width': 190 });
    return await doc.save(name);
  }

  async createReport(): Promise<void> {
    this.creating$.next(true);
    const report: Report = this.executionDirector.reportEssayDirector.createReport();
    await this.savePDF(report.html, 'report.pdf'); // TODO: essay name - ejecution ID
    this.creating$.next(false);
    return;
  }

}
