import { DecimalPipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, filter, map, Observable, of, switchMap, take, tap, timeout } from "rxjs";
import { Command, CommandManager, WorkingParametersStatus, WorkingParamsStatusEnum, PROTOCOL, ResponseStatus, ResponseStatusEnum, GeneratorStatus, GeneratorStatusEnum } from "../models";
import { MessagesService } from "./messages.service";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class GeneratorService {

  readonly errorCode$: BehaviorSubject<number | null>;
  readonly sendAndWaitInProgress$: BehaviorSubject<boolean>;
  readonly workingParamsStatus$: BehaviorSubject<WorkingParametersStatus>;
  readonly generatorStatus$: BehaviorSubject<GeneratorStatus>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.GENERATOR.NAME;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly messagesService: MessagesService,
    private readonly decimalPipe: DecimalPipe,
  ) {
    this.commandManager = new CommandManager(this.deviceFrom, this.deviceTo);
    this.errorCode$ = new BehaviorSubject<number | null>(null);
    this.sendAndWaitInProgress$ = new BehaviorSubject<boolean>(false);
    this.workingParamsStatus$ = new BehaviorSubject<WorkingParametersStatus>(WorkingParamsStatusEnum.UNKNOW);
    this.generatorStatus$ = new BehaviorSubject<GeneratorStatus>(GeneratorStatusEnum.UNKNOW);
  }

  private isAck(command: Command): boolean {
    const blocks = command.split(PROTOCOL.COMMAND.DIVIDER);
    return blocks.some((block) => block.includes('ACK'));
  }

  private isError(command: Command): boolean {
    const blocks = command.split(PROTOCOL.COMMAND.DIVIDER);
    return blocks.some((block) => block.includes('ERR'));
  }

  private getErrorCode(command: Command): number {
    const blocks = command.split(PROTOCOL.COMMAND.DIVIDER);
    const errorBlock = blocks.find((block) => block.includes('ERR'));
    return Number(errorBlock?.match(/\d/g)?.join(""));
  }

  private voltageTemplate(voltage: number): string {
    return `xxxx${this.decimalPipe.transform(voltage, '4.0')?.replace(/,/g, '')}`;
  }

  private currentTemplate(current: number): string {
    return `xxx${this.decimalPipe.transform(current, '5.0')?.replace(/,/g, '')}`;
  }

  private angleTemplate(angle: number): string {
    return `xxxx+${this.decimalPipe.transform(angle, '3.0')?.replace(/,/g, '')}`;
  }

  private sendAndWaitAsync$(command: Command): Observable<ResponseStatus> {
    return of(this.sendAndWaitInProgress$.next(true)).pipe(
      take(1),
      tap(() => this.usbHandlerService.send(command)),
      switchMap(() => this.usbHandlerService.getCommand$.pipe(
        filter((command) => this.commandManager.isForMe(command)),
        take(1),
        tap(() => this.errorCode$.next(null)),
        timeout({
          each: PROTOCOL.TIME.WAITING_RESPONSE_TIMEOUT,
          with: () => of(ResponseStatusEnum.TIMEOUT),
        }),
        map((command) => {
          if (this.isAck(command)) {
            return ResponseStatusEnum.ACK;
          }
          if (this.isError(command)) {
            this.errorCode$.next(this.getErrorCode(command));
            return ResponseStatusEnum.ERROR;
          }
          if (command === ResponseStatusEnum.TIMEOUT) {
            return ResponseStatusEnum.TIMEOUT;
          }
          return ResponseStatusEnum.UNKNOW;
        }),
        tap(() => this.sendAndWaitInProgress$.next(false)),
      )),
    );
  }

  clearStatus(): void {
    this.errorCode$.next(null);
    this.sendAndWaitInProgress$.next(false);
    this.workingParamsStatus$.next(WorkingParamsStatusEnum.UNKNOW);
    this.generatorStatus$.next(GeneratorStatusEnum.UNKNOW);
  }

  setWorkingParams$(
    voltageU1: number,
    voltageU2: number,
    voltageU3: number,
    currentI1: number,
    currentI2: number,
    currentI3: number,
    anglePhi1: number,
    anglePhi2: number,
    anglePhi3: number,
  ): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(
      PROTOCOL.DEVICE.GENERATOR.COMMAND.START,
      this.voltageTemplate(voltageU1),
      this.voltageTemplate(voltageU2),
      this.voltageTemplate(voltageU3),
      this.currentTemplate(currentI1),
      this.currentTemplate(currentI2),
      this.currentTemplate(currentI3),
      this.angleTemplate(anglePhi1),
      this.angleTemplate(anglePhi2),
      this.angleTemplate(anglePhi3),
    );
    return of(this.workingParamsStatus$.next(WorkingParamsStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      switchMap(() => this.sendAndWaitAsync$(command).pipe(
        tap((status) => {
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
        })
      ))
    );
  }

  getStatus$(delayTime: number): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STATUS);
    return of(this.generatorStatus$.next(GeneratorStatusEnum.REQUEST_IN_PROGRESS)).pipe(
      delay(delayTime),
      switchMap(() => this.sendAndWaitAsync$(command).pipe(
        tap((status) => {
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
        })
      ))
    );
  }

  turnOffSignals$(): Observable<ResponseStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STOP);
    return this.sendAndWaitAsync$(command).pipe(
      switchMap((status) => {
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
            return this.getStatus$(0);
        }
      })
    );
  }
}