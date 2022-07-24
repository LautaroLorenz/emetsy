import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent } from 'src/app/models';

@Component({
  selector: 'app-photocell-adjustment-execution-action',
  templateUrl: './photocell-adjustment-execution-action.component.html',
  styleUrls: ['./photocell-adjustment-execution-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentExecutionActionComponent implements ActionComponent {

  @Input() action!: Action;

  get helpText(): string {
    return !this.photocellAdjustmentExecutionComplete
      ? 'Realice el ajuste de fotocélulas y luego indique en el software cuando el ajuste fue realizado.'
      : 'Ya puede continuar.'
  }
  get photocellAdjustmentExecutionComplete(): boolean {
    return this.form.get('photocellAdjustmentExecutionComplete')?.value;
  }
  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }

  completeAction(): void {
    this.form.get('photocellAdjustmentExecutionComplete')?.setValue(true);
  }
}
