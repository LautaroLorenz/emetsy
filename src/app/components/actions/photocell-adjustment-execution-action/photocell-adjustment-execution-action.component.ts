import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Action, ActionComponent } from 'src/app/models';
import { GeneratorService } from 'src/app/services/devices/generator.service';

@Component({
  selector: 'app-photocell-adjustment-execution-action',
  templateUrl: './photocell-adjustment-execution-action.component.html',
  styleUrls: ['./photocell-adjustment-execution-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentExecutionActionComponent implements ActionComponent, AfterViewInit {

  @Input() action!: Action;

  get helpText(): string {
    return !this.photocellAdjustmentExecutionComplete
      ? 'Realice el ajuste de fotocélulas y luego indique en el software cuando el ajuste fue realizado.'
      : 'Ajuste de fotocélulas realizado, ya puede confirmar.'
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

  constructor(
    private readonly generatorService: GeneratorService,
  ) {}

  ngAfterViewInit(): void {
  }
}
