import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent, CompleteModeConstants } from 'src/app/models';

@Component({
  selector: 'app-run-configuration-action',
  templateUrl: './run-configuration-action.component.html',
  styleUrls: ['./run-configuration-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunConfigurationActionComponent implements ActionComponent {

  readonly CompleteModeConstants = CompleteModeConstants;

  @Input() action!: Action;

  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }
}
