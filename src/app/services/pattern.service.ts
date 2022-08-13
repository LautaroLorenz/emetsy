import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, filter, map, Observable, of, Subject, switchMap, take, takeUntil, takeWhile, tap } from "rxjs";
import { Command, CommandManager, PROTOCOL, ResponseStatus, ResponseStatusEnum, Phases, PatternParams, Device, DeviceStatusEnum, DeviceStatus } from "../models";
import { DeviceErrorCode } from "../pipes/device-error-code.pipe";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class PatternService implements Device {

  readonly sendStoper$: Subject<void>;
  readonly errorMessage$: BehaviorSubject<string | null>;
  readonly deviceStatus$: BehaviorSubject<DeviceStatus>;
  readonly params$: BehaviorSubject<PatternParams | null>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.PATTERN.NAME;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly deviceErrorCodePipe: DeviceErrorCode,
  ) {
    this.sendStoper$ = new Subject<void>();
    this.errorMessage$ = new BehaviorSubject<string | null>(null);
    this.deviceStatus$ = new BehaviorSubject<DeviceStatus>(DeviceStatusEnum.UNKNOWN);
    this.params$ = new BehaviorSubject<PatternParams | null>(null);

    this.commandManager = new CommandManager(this.deviceFrom, this.deviceTo);
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
        this.errorMessage$.next('Error: '.concat(errorCode ? this.deviceErrorCodePipe.transform(errorCode) : 'sin código'));
        return status;
      case ResponseStatusEnum.UNKNOWN:
        this.errorMessage$.next('Error: no se pudo procesar el comando');
        return status;
    }
  }

  private setParams(params: string[]): void {
    this.params$.next({
      constant: params[0],
      phases: {
        phaseL1: {
          voltageU1: this.commandManager.formatString(params[1], 4, 1),
          currentI1: this.commandManager.formatString(params[4], 5, 2),
          anglePhi1: this.commandManager.formatString(params[7], 4, 1),
        },
        phaseL2: {
          voltageU2: this.commandManager.formatString(params[2], 4, 1),
          currentI2: this.commandManager.formatString(params[5], 5, 2),
          anglePhi2: this.commandManager.formatString(params[8], 4, 1),
        },
        phaseL3: {
          voltageU3: this.commandManager.formatString(params[3], 4, 1),
          currentI3: this.commandManager.formatString(params[6], 5, 2),
          anglePhi3: this.commandManager.formatString(params[9], 4, 1),
        }
      }
    });
  }

  private reportLoop$(): Observable<ResponseStatus> {
    return of(true).pipe(
      delay(PROTOCOL.TIME.LOOP.STATUS_REPORTING),
      take(1),
      switchMap(() => this.getStatus$()),
      filter((status) => status === ResponseStatusEnum.ACK),
      switchMap(() => this.reportLoop$())
    );
  }

  startRerporting(): void {
    this.sendStoper$.next();
    this.reportLoop$().pipe(
      takeUntil(this.sendStoper$),
      takeWhile(() => this.usbHandlerService.connected$.value),
    ).subscribe();
  }

  clearStatus(): void {
    this.errorMessage$.next(null);
    this.params$.next(null);
    this.deviceStatus$.next(DeviceStatusEnum.UNKNOWN);
  }

  turnOn$(phases: Phases): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(
      PROTOCOL.DEVICE.PATTERN.COMMAND.START,
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
      ))
    );
  }

  getStatus$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.PATTERN.COMMAND.STATUS);
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
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.PATTERN.COMMAND.STOP);
    return of(true).pipe(
      tap(() => this.sendStoper$.next()),
      delay(PROTOCOL.TIME.LOOP.GET_COMMAND * 4),
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
