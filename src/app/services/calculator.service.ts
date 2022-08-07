import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, filter, map, Observable, of, Subject, switchMap, take, takeUntil, takeWhile, tap } from "rxjs";
import { CalculatorParams, Command, CommandManager, Device, DeviceStatus, DeviceStatusEnum, PROTOCOL, ResponseStatus, ResponseStatusEnum, WorkingParamsStatus, WorkingParamsStatusEnum } from "../models";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class CalculatorService implements Device {

  readonly sendStoper$: Subject<void>;
  readonly errorMessage$: BehaviorSubject<string | null>;
  readonly deviceStatus$: BehaviorSubject<DeviceStatus>;
  readonly params$: BehaviorSubject<CalculatorParams | null>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.CALCULATOR.NAME;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
  ) {
    this.sendStoper$ = new Subject<void>();
    this.errorMessage$ = new BehaviorSubject<string | null>(null);
    this.deviceStatus$ = new BehaviorSubject<DeviceStatus>(DeviceStatusEnum.UNKNOWN);
    this.params$ = new BehaviorSubject<CalculatorParams | null>(null);

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
        this.errorMessage$.next('Error: '.concat(errorCode ? errorCode.toString() : 'sin código'));
        return status;
      case ResponseStatusEnum.UNKNOWN:
        this.errorMessage$.next('Error: no se pudo procesar el comando');
        return status;
    }
  }

  private setParams(params: string[]): void {
    this.params$.next({
      results: params
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

  turnOn$(
    // phases: Phases // TODO:
  ): Observable<ResponseStatus> {
    // const command: Command = this.commandManager.build(
    //   PROTOCOL.DEVICE.CALCULATOR.COMMAND.ESSAY.CONTRAST,
    //   this.commandManager.formatNumber(phases.phaseL1.voltageU1, 'xxxx', 4, false),
    //   this.commandManager.formatNumber(phases.phaseL2.voltageU2, 'xxxx', 4, false),
    //   this.commandManager.formatNumber(phases.phaseL3.voltageU3, 'xxxx', 4, false),
    //   this.commandManager.formatNumber(phases.phaseL1.currentI1, 'xxx', 5, false),
    //   this.commandManager.formatNumber(phases.phaseL2.currentI2, 'xxx', 5, false),
    //   this.commandManager.formatNumber(phases.phaseL3.currentI3, 'xxx', 5, false),
    //   this.commandManager.formatNumber(phases.phaseL1.anglePhi1, 'xxxx', 3, true),
    //   this.commandManager.formatNumber(phases.phaseL2.anglePhi2, 'xxxx', 3, true),
    //   this.commandManager.formatNumber(phases.phaseL3.anglePhi3, 'xxxx', 3, true),
    // );
    // TODO:
    const command: Command = 'B| PCS| CAL| TS1xxxxx| 1234567891| 00000015| P0101200| P0201200| P0300750| P04     | P06     | P07     | P08     | P09     | P10     | P11     | P12     | P13     | P14     | P15     | P16     | P17     | P18     | P19     | P20     | Z| ';
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
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.CALCULATOR.COMMAND.STATUS);
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
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.CALCULATOR.COMMAND.STOP);
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
