import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, filter, map, Observable, of, Subject, switchMap, take, takeUntil, takeWhile, tap } from "rxjs";
import { Command, CommandManager, WorkingParamsStatus, WorkingParamsStatusEnum, PROTOCOL, ResponseStatus, ResponseStatusEnum, PatternStatus, PatternStatusEnum, Phases, PatternParams } from "../models";
import { MessagesService } from "./messages.service";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class PatternService {

  readonly workingParamsStatus$: BehaviorSubject<WorkingParamsStatus>;
  readonly patternStatus$: BehaviorSubject<PatternStatus>;
  readonly errorCode$: BehaviorSubject<number | null>;
  readonly params$: BehaviorSubject<PatternParams | null>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.PATTERN.NAME;
  private readonly reportingStoper$: Subject<void>;
  private readonly getStatusStoper$: Subject<void>;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly messagesService: MessagesService,
  ) {
    this.errorCode$ = new BehaviorSubject<number | null>(null);
    this.params$ = new BehaviorSubject<PatternParams | null>(null);
    this.workingParamsStatus$ = new BehaviorSubject<WorkingParamsStatus>(WorkingParamsStatusEnum.UNKNOW);
    this.patternStatus$ = new BehaviorSubject<PatternStatus>(PatternStatusEnum.UNKNOW);

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
    this.patternStatus$.next(PatternStatusEnum.UNKNOW);
  }

  setWorkingParams$(phases: Phases): Observable<ResponseStatus> {
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
              this.messagesService.error('No se pudo configurar los parámetros de trabajo de la señal patrón.');
              break;
          }
          return status;
        })
      )),
    );
  }

  getStatus$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.PATTERN.COMMAND.STATUS);

    let newState: PatternStatus;
    if (this.patternStatus$.value !== PatternStatusEnum.REPORTING) {
      newState = PatternStatusEnum.REQUEST_IN_PROGRESS;
    } else {
      newState = PatternStatusEnum.REPORTING;
    }

    return of(this.patternStatus$.next(newState)).pipe(
      takeUntil(this.getStatusStoper$),
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode, params }) => {
          this.errorCode$.next(errorCode);
          switch (status) {
            case ResponseStatusEnum.ACK:
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
              this.patternStatus$.next(PatternStatusEnum.REPORTING);
              break;
            case ResponseStatusEnum.ERROR:
              this.patternStatus$.next(PatternStatusEnum.ERROR);
              break;
            case ResponseStatusEnum.TIMEOUT:
            case ResponseStatusEnum.UNKNOW:
              this.patternStatus$.next(PatternStatusEnum.TIMEOUT);
              this.messagesService.error('No se pudo obtener el estado de la señal patrón.');
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
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.PATTERN.COMMAND.STOP);
    return of(this.patternStatus$.next(PatternStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      tap(() => this.reportingStoper$.next()),
      tap(() => this.getStatusStoper$.next()),
      delay(PROTOCOL.TIME.LOOP.GET_COMMAND * 4),
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        switchMap(({ status }) => {
          switch (status) {
            case ResponseStatusEnum.ACK:
              this.clearStatus();
              this.workingParamsStatus$.next(WorkingParamsStatusEnum.PARAMETERS_TURN_OFF);
              this.patternStatus$.next(PatternStatusEnum.TURN_OFF);
              return of(status);
            case ResponseStatusEnum.ERROR:
            case ResponseStatusEnum.TIMEOUT:
            case ResponseStatusEnum.UNKNOW:
              this.messagesService.error('No se pudo apagar el patrón.');
              return this.getStatus$();
          }
        })
      ))
    );
  }

}
