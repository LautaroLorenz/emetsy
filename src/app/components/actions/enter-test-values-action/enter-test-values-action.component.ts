import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent, MeterConstants } from 'src/app/models';

@Component({
  selector: 'app-enter-test-values-action',
  templateUrl: './enter-test-values-action.component.html',
  styleUrls: ['./enter-test-values-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterTestValuesActionComponent implements ActionComponent {

  readonly name = 'Valores generales de la prueba';
  readonly MeterConstants = MeterConstants;

  @Input() action!: Action;

  get form(): FormGroup {
    return this.action.form;
  }
}
