import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent } from 'src/app/models';

@Component({
  selector: 'app-user-identification-action',
  templateUrl: './user-identification-action.component.html',
  styleUrls: ['./user-identification-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIdentificationActionComponent implements ActionComponent {

  @Input() action!: Action;

  get name(): string {
    return this.action.name;
  }

  get form(): FormGroup {
    return this.action.form;
  }
}
