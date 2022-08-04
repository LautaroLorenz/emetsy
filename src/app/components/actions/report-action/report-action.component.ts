import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent, Report } from 'src/app/models';
import { ExecutionDirector } from 'src/app/services/execution-director.service';

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

  constructor(
    private readonly executionDirector: ExecutionDirector,
  ) {}

  downloadReport(): void {
    const report: Report = this.executionDirector.reportEssayDirector.createReport();
    console.log(report.html);
  }
}