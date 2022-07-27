import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, filter, ReplaySubject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, PhotocellAdjustmentExecutionAction, PhotocellAdjustmentValuesAction, PROTOCOL, ResponseStatusEnum } from 'src/app/models';
import { GeneratorService } from 'src/app/services/generator.service';
import { UsbHandlerService } from 'src/app/services/usb-handler.service';

@Component({
  selector: 'app-photocell-adjustment-execution-action',
  templateUrl: './photocell-adjustment-execution-action.component.html',
  styleUrls: ['./photocell-adjustment-execution-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentExecutionActionComponent implements ActionComponent, AfterViewInit, OnDestroy {

  @Input() action!: Action;

  readonly initialized$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

  get helpText(): string {
    return !this.photocellAdjustmentExecutionComplete
      ? 'Realice el ajuste de fotocélulas y luego indique en el software que el ajuste fue realizado.'
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
  get connected(): boolean {
    return this.usbHandlerService.connected$.value;
  }

  completeAction(): void {
    this.generatorService.turnOffSignals$().pipe(
      take(1),
      filter((status) => status === ResponseStatusEnum.ACK),
      tap(() => this.form.get('photocellAdjustmentExecutionComplete')?.setValue(true)),
    ).subscribe();
  }

  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
  ) {
    /**
     * TODO: GENERADOR
     * --------------------------------------
     * conectar con el hardware (si no está conectado) - OK
     * enviar start
     * esperar 2s
     * consultar estado
     * --------------------------------------
     * Será necesario iniciar el patrón para poder hacer lo siguiente:
     *  - iniciar loop 0.5s, consultando valores al patrón.
     * --------------------------------------
     * la acción se completa una vez que se apaga el generador y el patrón
     * --------------------------------------
     */
  }

  ngAfterViewInit(): void {
    const phaseL1 = this.photocellAdjustmentValuesAction.getPhase('L1');
    const phaseL2 = this.photocellAdjustmentValuesAction.getPhase('L2');
    const phaseL3 = this.photocellAdjustmentValuesAction.getPhase('L3');

    this.usbHandlerService.connected$.pipe(
      takeUntil(this.destroyed$),
      takeWhile(() => !this.photocellAdjustmentExecutionComplete),
      tap(() => {
        this.initialized$.next(false);
        this.generatorService.clearStatus();
      }),
      filter((isConnected) => isConnected),
      switchMap(() => this.generatorService.setWorkingParams$(
        phaseL1.voltageU1,
        phaseL2.voltageU2,
        phaseL3.voltageU3,
        phaseL1.currentI1,
        phaseL2.currentI2,
        phaseL3.currentI3,
        phaseL1.anglePhi1,
        phaseL2.anglePhi2,
        phaseL3.anglePhi3,
      ).pipe(
        switchMap(() => this.generatorService.getStatus$())
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      tap(() => this.initialized$.next(true)),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
