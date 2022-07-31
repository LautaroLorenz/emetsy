import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, filter, map, Observable, of, Subject, switchMap, take, takeUntil, takeWhile, tap } from "rxjs";
import { CalculatorParams, CalculatorStatus, CalculatorStatusEnum, Command, CommandManager, PROTOCOL, ResponseStatus, ResponseStatusEnum, WorkingParamsStatus, WorkingParamsStatusEnum } from "../models";
import { MessagesService } from "./messages.service";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class CalculatorService {

  readonly workingParamsStatus$: BehaviorSubject<WorkingParamsStatus>;
  readonly calculatorStatus$: BehaviorSubject<CalculatorStatus>;
  readonly errorCode$: BehaviorSubject<number | null>;
  readonly params$: BehaviorSubject<CalculatorParams | null>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.CALCULATOR.NAME;
  private readonly reportingStoper$: Subject<void>;
  private readonly getStatusStoper$: Subject<void>;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly messagesService: MessagesService,
  ) {
    this.errorCode$ = new BehaviorSubject<number | null>(null);
    this.params$ = new BehaviorSubject<CalculatorParams | null>(null);
    this.workingParamsStatus$ = new BehaviorSubject<WorkingParamsStatus>(WorkingParamsStatusEnum.UNKNOW);
    this.calculatorStatus$ = new BehaviorSubject<CalculatorStatus>(CalculatorStatusEnum.UNKNOW);

    this.commandManager = new CommandManager(this.deviceFrom, this.deviceTo);
    this.reportingStoper$ = new Subject<any>();
    this.getStatusStoper$ = new Subject<any>();
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

  clearStatus(): void {
    this.errorCode$.next(null);
    this.params$.next(null);
    this.reportingStoper$.next();
    this.getStatusStoper$.next();

    this.workingParamsStatus$.next(WorkingParamsStatusEnum.UNKNOW);
    this.calculatorStatus$.next(CalculatorStatusEnum.UNKNOW);
  }

  setWorkingParams$(
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
    const command: Command = 'B| PCS| CAL| TS1xxxxx| 1234567891| 00000015| P0101200| P0201200| P03     | P0400750| P0500750| Z| x';
    return of(this.workingParamsStatus$.next(WorkingParamsStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode }) => {
          this.errorCode$.next(errorCode);
          switch (status) {
            case ResponseStatusEnum.ACK:
              this.workingParamsStatus$.next(WorkingParamsStatusEnum.PARAMETERS_SET_CORRECTLY);
              break;
            case ResponseStatusEnum.ERROR:
            case ResponseStatusEnum.TIMEOUT:
            case ResponseStatusEnum.UNKNOW:
              this.workingParamsStatus$.next(WorkingParamsStatusEnum.PARAMETERS_SET_ERROR);
              this.messagesService.error('No se pudo configurar los parámetros de trabajo del calculador.');
              break;
          }
          return status;
        })
      )),
    );
  }

  getStatus$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.CALCULATOR.COMMAND.STATUS);

    let newState: CalculatorStatus;
    if (this.calculatorStatus$.value !== CalculatorStatusEnum.REPORTING) {
      newState = CalculatorStatusEnum.REQUEST_IN_PROGRESS;
    } else {
      newState = CalculatorStatusEnum.REPORTING;
    }

    return of(this.calculatorStatus$.next(newState)).pipe(
      takeUntil(this.getStatusStoper$),
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode, params }) => {
          this.errorCode$.next(errorCode);
          switch (status) {
            case ResponseStatusEnum.ACK:
              this.params$.next({
                results: params
              });
              this.calculatorStatus$.next(CalculatorStatusEnum.REPORTING);
              break;
            case ResponseStatusEnum.ERROR:
              this.calculatorStatus$.next(CalculatorStatusEnum.ERROR);
              break;
            case ResponseStatusEnum.TIMEOUT:
            case ResponseStatusEnum.UNKNOW:
              this.calculatorStatus$.next(CalculatorStatusEnum.TIMEOUT);
              this.messagesService.error('No se pudo obtener el estado del calculador.');
              break;
          }
          return status;
        }),
      ))
    );
  }

  startRerporting(): void {
    this.reportingStoper$.next();
    this.reportLoop$().pipe(
      takeUntil(this.reportingStoper$),
      takeWhile(() => this.usbHandlerService.connected$.value),
    ).subscribe();
  }

  turnOff$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.CALCULATOR.COMMAND.STOP);
    return of(this.calculatorStatus$.next(CalculatorStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      tap(() => this.reportingStoper$.next()),
      tap(() => this.getStatusStoper$.next()),
      delay(PROTOCOL.TIME.LOOP.GET_COMMAND * 4),
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        switchMap(({ status }) => {
          switch (status) {
            case ResponseStatusEnum.ACK:
              this.clearStatus();
              this.workingParamsStatus$.next(WorkingParamsStatusEnum.PARAMETERS_TURN_OFF);
              this.calculatorStatus$.next(CalculatorStatusEnum.TURN_OFF);
              return of(status);
            case ResponseStatusEnum.ERROR:
            case ResponseStatusEnum.TIMEOUT:
            case ResponseStatusEnum.UNKNOW:
              this.messagesService.error('No se pudo apagar el calculador.');
              return this.getStatus$();
          }
        })
      ))
    );
  }

}
