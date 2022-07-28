import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, interval, map, Observable, of, switchMap, takeWhile, tap } from "rxjs";
import { Command, CommandManager, WorkingParametersStatus, WorkingParamsStatusEnum, PROTOCOL, ResponseStatus, ResponseStatusEnum, PatternStatus, PatternStatusEnum, Phases } from "../models";
import { MessagesService } from "./messages.service";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class PatternService {

  readonly workingParamsStatus$: BehaviorSubject<WorkingParametersStatus>;
  readonly patternStatus$: BehaviorSubject<PatternStatus>;
  readonly errorCode$: BehaviorSubject<number | null>;
  readonly params$: BehaviorSubject<Phases | null>;
  readonly constant$: BehaviorSubject<string | null>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.PATTERN.NAME;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly messagesService: MessagesService,
  ) {
    this.errorCode$ = new BehaviorSubject<number | null>(null);
    this.params$ = new BehaviorSubject<Phases | null>(null);
    this.constant$ = new BehaviorSubject<string | null>(null);
    this.commandManager = new CommandManager(this.deviceFrom, this.deviceTo);
    this.workingParamsStatus$ = new BehaviorSubject<WorkingParametersStatus>(WorkingParamsStatusEnum.UNKNOW);
    this.patternStatus$ = new BehaviorSubject<PatternStatus>(PatternStatusEnum.UNKNOW);
  }

  clearStatus(): void {
    this.errorCode$.next(null);
    this.params$.next(null);
    this.constant$.next(null);
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
    return of(this.patternStatus$.next(PatternStatusEnum.REPORTING)).pipe(
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode, params }) => {
          this.errorCode$.next(errorCode);
          switch (status) {
            case ResponseStatusEnum.ACK:
              this.constant$.next(params[0]);
              this.params$.next({
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

  startReportingLoop$(): Observable<ResponseStatus> {
    this.patternStatus$.next(PatternStatusEnum.REPORTING);
    return interval(PROTOCOL.TIME.LOOP.STATUS_REPORTING).pipe(
      takeWhile(() => this.patternStatus$.value !== PatternStatusEnum.TURN_OFF),
      takeWhile(() => this.patternStatus$.value === PatternStatusEnum.REPORTING),
      takeWhile(() => this.usbHandlerService.connected$.value),
      switchMap(() => this.getStatus$()),
    );
  }

  turnOffSignals$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.PATTERN.COMMAND.STOP);
    return of(this.patternStatus$.next(PatternStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      delay(PROTOCOL.TIME.LOOP.STATUS_REPORTING * 2),
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
              this.messagesService.error('No se pudo apagar el generador.');
              return this.getStatus$();
          }
        })
      ))
    );
  }
}