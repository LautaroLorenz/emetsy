import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent } from 'src/app/models';

@Component({
  selector: 'app-contrast-test-parameters-action',
  templateUrl: './contrast-test-parameters-action.component.html',
  styleUrls: ['./contrast-test-parameters-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContrastTestParametersActionComponent implements ActionComponent {

  readonly name = 'Parámetros para la prueba de contraste';

  @Input() action!: Action;

  get form(): FormGroup {
    return this.action.form;
  }
}
