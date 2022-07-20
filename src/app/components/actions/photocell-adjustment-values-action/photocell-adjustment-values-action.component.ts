import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent } from 'src/app/models';

@Component({
  selector: 'app-photocell-adjustment-values-action',
  templateUrl: './photocell-adjustment-values-action.component.html',
  styleUrls: ['./photocell-adjustment-values-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentValuesActionComponent implements ActionComponent {

  readonly name = 'Valores para ajuste de fotocélula';

  @Input() action!: Action;

  get form(): FormGroup {
    return this.action.form;
  }
}
