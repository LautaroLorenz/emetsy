import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, map, Observable, of, Subject, switchMap, takeUntil, tap } from "rxjs";
import { Command, CommandManager, PROTOCOL, ResponseStatus, ResponseStatusEnum, Phases, Device, DeviceStatus, DeviceStatusEnum } from "../models";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class GeneratorService implements Device {

  readonly sendStoper$: Subject<void>;
  readonly errorMessage$: BehaviorSubject<string | null>;
  readonly deviceStatus$: BehaviorSubject<DeviceStatus>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.GENERATOR.NAME;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
  ) {
    this.sendStoper$ = new Subject<void>();
    this.errorMessage$ = new BehaviorSubject<string | null>(null);
    this.commandManager = new CommandManager(this.deviceFrom, this.deviceTo);
    this.deviceStatus$ = new BehaviorSubject<DeviceStatus>(DeviceStatusEnum.UNKNOWN);
  }

  private checkIsErrorResponseOrSetParams(status: ResponseStatus, errorCode: number | null, params: string[]): ResponseStatus {
    switch (status) {
      case ResponseStatusEnum.ACK:
        if (params.length > 0) {
          this.setParams(params);
        }
        this.errorMessage$.next(null);
        return status;
      case ResponseStatusEnum.TIMEOUT:
        this.errorMessage$.next('Error: No responde');
        return status;
      case ResponseStatusEnum.ERROR:
        this.errorMessage$.next('Error: '.concat(errorCode ? errorCode.toString() : 'sin código'));
        return status;
      case ResponseStatusEnum.UNKNOWN:
        this.errorMessage$.next('Error: no se pudo procesar el comando');
        return status;
    }
  }

  private setParams(params: string[]): void { }

  clearStatus(): void {
    this.errorMessage$.next(null);
    this.deviceStatus$.next(DeviceStatusEnum.UNKNOWN);
  }

  turnOn$(phases: Phases): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(
      PROTOCOL.DEVICE.GENERATOR.COMMAND.START,
      this.commandManager.formatNumber(phases.phaseL1.voltageU1, 'xxxx', 4, false),
      this.commandManager.formatNumber(phases.phaseL2.voltageU2, 'xxxx', 4, false),
      this.commandManager.formatNumber(phases.phaseL3.voltageU3, 'xxxx', 4, false),
      this.commandManager.formatNumber(phases.phaseL1.currentI1, 'xxx', 5, false),
      this.commandManager.formatNumber(phases.phaseL2.currentI2, 'xxx', 5, false),
      this.commandManager.formatNumber(phases.phaseL3.currentI3, 'xxx', 5, false),
      this.commandManager.formatNumber(phases.phaseL1.anglePhi1, 'xxxx', 3, true),
      this.commandManager.formatNumber(phases.phaseL2.anglePhi2, 'xxxx', 3, true),
      this.commandManager.formatNumber(phases.phaseL3.anglePhi3, 'xxxx', 3, true),
    );
    return of(true).pipe(
      takeUntil(this.sendStoper$),
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode, params }) => this.checkIsErrorResponseOrSetParams(status, errorCode, params)),
        tap((status) => {
          if (status === ResponseStatusEnum.ACK) {
            this.deviceStatus$.next(DeviceStatusEnum.TURN_ON);
          } else {
            this.deviceStatus$.next(DeviceStatusEnum.FAIL);
          }
        }),
        switchMap((status) => {
          switch (status) {
            case ResponseStatusEnum.ACK:
              return of(status).pipe(
                delay(PROTOCOL.TIME.WAIT_STABILIZATION),
              );
          }
          return of(status);
        }),
      ))
    );
  }

  getStatus$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STATUS);
    return of(true).pipe(
      takeUntil(this.sendStoper$),
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode, params }) => this.checkIsErrorResponseOrSetParams(status, errorCode, params)),
        tap((status) => {
          if (status !== ResponseStatusEnum.ACK) {
            this.deviceStatus$.next(DeviceStatusEnum.FAIL);
          }
        }),
      ))
    );
  }

  turnOff$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STOP);
    return of(true).pipe(
      tap(() => this.sendStoper$.next()),
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode, params }) => this.checkIsErrorResponseOrSetParams(status, errorCode, params)),
        tap((status) => {
          if (status === ResponseStatusEnum.ACK) {
            this.deviceStatus$.next(DeviceStatusEnum.TURN_OFF);
          } else {
            this.deviceStatus$.next(DeviceStatusEnum.FAIL);
          }
        }),
      )),
    );
  }
}