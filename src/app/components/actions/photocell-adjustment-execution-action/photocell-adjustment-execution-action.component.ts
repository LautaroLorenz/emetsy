import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, delay, filter, Observable, ReplaySubject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, DeviceGetStatus, PhotocellAdjustmentExecutionAction, PhotocellAdjustmentValuesAction, PROTOCOL } from 'src/app/models';
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
  get generatorHasError(): boolean {
    return ['ERROR', 'TIMEOUT'].includes(this.generatorService.devicePostStatus$.value);
  }
  get connected(): boolean {
    return this.usbHandlerService.connected$.value;
  }

  completeAction(): void {
    this.generatorService.turnOffSignals$().pipe(
      take(1),
      filter((status) => status === 'ACK'),
      tap(() => this.generatorService.stop()),
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

  private setGeneratorWorkingParams$(): Observable<DeviceGetStatus> {
    const phaseL1 = this.photocellAdjustmentValuesAction.getPhase('L1');
    const phaseL2 = this.photocellAdjustmentValuesAction.getPhase('L2');
    const phaseL3 = this.photocellAdjustmentValuesAction.getPhase('L3');
    return this.generatorService.setWorkingParams$(
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

  private startGeneratorCheckStatusLoop(): void {
    this.generatorService.getStatus$().pipe(
      delay(PROTOCOL.TIME.LOOP.CHECK_DEVICE_STATUS),
      takeWhile(() => this.generatorService.deviceStatus$.value === 'ON'),
      take(1),
      filter((status) => status === 'ACK'),
      tap(() => this.startGeneratorCheckStatusLoop()),
    ).subscribe();
    return;
  }

  ngAfterViewInit(): void {
    this.usbHandlerService.connected$.pipe(
      takeUntil(this.destroyed$),
      filter((isConnected) => isConnected),
      tap(() => this.generatorService.start()),
      switchMap(() => this.setGeneratorWorkingParams$().pipe(
        take(1),
        filter((status) => status === 'ACK'),
        tap(() => this.startGeneratorCheckStatusLoop()),
      )),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.generatorService.stop();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
