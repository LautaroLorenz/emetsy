import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, map, Observable, of, switchMap, tap } from "rxjs";
import { Command, CommandManager, WorkingParamsStatus, WorkingParamsStatusEnum, PROTOCOL, ResponseStatus, ResponseStatusEnum, GeneratorStatus, GeneratorStatusEnum, Phases } from "../models";
import { MessagesService } from "./messages.service";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class GeneratorService {

  readonly errorCode$: BehaviorSubject<number | null>;
  readonly workingParamsStatus$: BehaviorSubject<WorkingParamsStatus>;
  readonly generatorStatus$: BehaviorSubject<GeneratorStatus>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.GENERATOR.NAME;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly messagesService: MessagesService,
  ) {
    this.errorCode$ = new BehaviorSubject<number | null>(null);
    this.commandManager = new CommandManager(this.deviceFrom, this.deviceTo);
    this.workingParamsStatus$ = new BehaviorSubject<WorkingParamsStatus>(WorkingParamsStatusEnum.UNKNOW);
    this.generatorStatus$ = new BehaviorSubject<GeneratorStatus>(GeneratorStatusEnum.UNKNOW);
  }

  clearStatus(): void {
    this.errorCode$.next(null);
    this.workingParamsStatus$.next(WorkingParamsStatusEnum.UNKNOW);
    this.generatorStatus$.next(GeneratorStatusEnum.UNKNOW);
  }

  setWorkingParams$(phases: Phases): Observable<ResponseStatus> {
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
              this.messagesService.error('No se pudo configurar los parámetros de trabajo del generador.');
              break;
          }
          return status;
        })
      )),
      switchMap((status) => {
        switch (status) {
          case ResponseStatusEnum.ACK:
            this.generatorStatus$.next(GeneratorStatusEnum.WAITING_FOR_STABILIZATION);
            return of(status).pipe(
              delay(PROTOCOL.TIME.WAIT_STABILIZATION),
              tap(() => this.generatorStatus$.next(GeneratorStatusEnum.STABILIZED))
            );
        }
        return of(status);
      }),
    );
  }

  getStatus$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STATUS);
    return of(this.generatorStatus$.next(GeneratorStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        map(({ status, errorCode }) => {
          this.errorCode$.next(errorCode);
          switch (status) {
            case ResponseStatusEnum.ACK:
              this.generatorStatus$.next(GeneratorStatusEnum.WORKING);
              break;
            case ResponseStatusEnum.ERROR:
              this.generatorStatus$.next(GeneratorStatusEnum.ERROR);
              break;
            case ResponseStatusEnum.TIMEOUT:
            case ResponseStatusEnum.UNKNOW:
              this.generatorStatus$.next(GeneratorStatusEnum.TIMEOUT);
              this.messagesService.error('No se pudo obtener el estado del generador.');
              break;
          }
          return status;
        }),
      ))
    );
  }

  turnOff$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STOP);
    return of(this.generatorStatus$.next(GeneratorStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      switchMap(() => this.usbHandlerService.sendAndWaitAsync$(command, this.commandManager).pipe(
        switchMap(({ status }) => {
          switch (status) {
            case ResponseStatusEnum.ACK:
              this.clearStatus();
              this.workingParamsStatus$.next(WorkingParamsStatusEnum.PARAMETERS_TURN_OFF);
              this.generatorStatus$.next(GeneratorStatusEnum.TURN_OFF);
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