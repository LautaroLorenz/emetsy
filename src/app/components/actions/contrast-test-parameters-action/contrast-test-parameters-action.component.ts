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

  @Input() action!: Action;

  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }
}
