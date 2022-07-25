import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first, tap } from 'rxjs';
import { Action, ActionComponent, PhotocellAdjustmentExecutionAction, PhotocellAdjustmentValuesAction } from 'src/app/models';
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
  get photocellAdjustmentValuesAction(): PhotocellAdjustmentValuesAction {
    return (this.action as PhotocellAdjustmentExecutionAction).photocellAdjustmentValuesAction;
  }

  completeAction(): void {
    this.form.get('photocellAdjustmentExecutionComplete')?.setValue(true);
  }

  constructor(
    private readonly generatorService: GeneratorService,
  ) {
    /**
     * TODO: GENERADOR
     * --------------------------------------
     * enviar start
     * esperar 2s
     * consultar estado
     * --------------------------------------
     * iniciar loop 0.5s, consultando valores al patrón.
     * --------------------------------------
     * la acción se completa una vez que se apaga el generador.
     * --------------------------------------
     */
  }

  test1(): void {
    const phaseL1 = this.photocellAdjustmentValuesAction.getPhase('L1');
    const phaseL2 = this.photocellAdjustmentValuesAction.getPhase('L2');
    const phaseL3 = this.photocellAdjustmentValuesAction.getPhase('L3');
    this.generatorService.turnOn(
      phaseL1.voltageU1,
      phaseL2.voltageU2,
      phaseL3.voltageU3,
      phaseL1.currentI1,
      phaseL2.currentI2,
      phaseL3.currentI3,
      phaseL1.anglePhi1,
      phaseL2.anglePhi2,
      phaseL3.anglePhi3,
    );
  }

  test2(): void {
    this.generatorService.turnOff();
  }

  test3(): void {
    this.generatorService.getState();
  }

  ngAfterViewInit(): void {
  }
}
