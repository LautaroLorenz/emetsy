import { DecimalPipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, Observable, skip, Subscription, take, tap } from "rxjs";
import { Command, CommandManager, DeviceACK, DeviceERROR, DeviceGetStatus, DevicePostStatus, DeviceStatus, PROTOCOL } from "../models";
import { MessagesService } from "./messages.service";
import { UsbHandlerService } from "./usb-handler.service";

@Injectable({
  providedIn: "root"
})
export class GeneratorService {

  readonly devicePostStatus$: BehaviorSubject<DevicePostStatus>;
  readonly deviceStatus$: BehaviorSubject<DeviceStatus>;
  readonly errorCode$: BehaviorSubject<number | null>;

  private readonly commandManager: CommandManager;
  private readonly deviceFrom = PROTOCOL.DEVICE.SOFTWARE.NAME;
  private readonly deviceTo = PROTOCOL.DEVICE.GENERATOR.NAME;

  private isRunning: boolean | null = null;
  private waitingResponseTimeout: any;
  private listenCommandsSubscription: Subscription | null = null;

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly messagesService: MessagesService,
    private readonly decimalPipe: DecimalPipe,
  ) {
    this.commandManager = new CommandManager(this.deviceFrom, this.deviceTo);
    this.devicePostStatus$ = new BehaviorSubject<DevicePostStatus>('UNKNOW');
    this.deviceStatus$ = new BehaviorSubject<DeviceStatus>('UNKNOW');
    this.errorCode$ = new BehaviorSubject<number | null>(null);
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

  private startListenCommands(): void {
    this.stopListenCommands(); // prevent resubscription
    this.listenCommandsSubscription = this.usbHandlerService.getCommand$.pipe(
      filter((command) => this.commandManager.isForMe(command)),
      tap(() => this.stopWaitingResponseTimeout()),
      tap((command) => {
        if (this.isAck(command)) {
          const ack: DeviceACK = 'ACK';
          this.errorCode$.next(null);
          this.devicePostStatus$.next(ack);
        }
        if (this.isError(command)) {
          const error: DeviceERROR = 'ERROR';
          const errorCode = this.getErrorCode(command);
          this.errorCode$.next(errorCode);
          this.devicePostStatus$.next(error);
        }
      }),
    ).subscribe();
    return;
  }

  private stopListenCommands(): void {
    if (this.listenCommandsSubscription && !this.listenCommandsSubscription.closed) {
      this.listenCommandsSubscription.unsubscribe();
    }
  }

  private stopWaitingResponseTimeout(): void {
    if (this.waitingResponseTimeout) {
      clearTimeout(this.waitingResponseTimeout);
    }
  }

  private startWaitingResponseTimeout(): void {
    if (this.devicePostStatus$.value === 'UNKNOW') {
      this.devicePostStatus$.next('WAITING_RESPONSE');
    }
    this.waitingResponseTimeout = setTimeout(() => {
      if(!this.isRunning) {
        return;
      }
      this.devicePostStatus$.next('TIMEOUT');
    }, PROTOCOL.TIME.WAITING_RESPONSE_TIMEOUT);
    return;
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

  private sendSync$(command: Command): Observable<DeviceGetStatus> {
    this.usbHandlerService.send(command);
    this.startWaitingResponseTimeout();
    return this.devicePostStatus$.pipe(
      skip(1),
      take(1),
      filter((status) => ['ACK', 'ERROR', 'TIMEOUT'].includes(status)),
      tap((status) => {
        if(status === 'ERROR') {
          this.deviceStatus$.next('OFF');
        }
        if(status === 'TIMEOUT') {
          this.deviceStatus$.next('UNKNOW');
        }
      }),
      map((status) => status as DeviceGetStatus)
    );
  }

  start(): void {
    this.isRunning = true;
    this.devicePostStatus$.next('UNKNOW');
    this.startListenCommands();
    return;
  }

  stop(): void {
    this.isRunning = false;
    this.stopListenCommands();
    this.stopWaitingResponseTimeout();
    this.devicePostStatus$.next('UNKNOW');
    this.deviceStatus$.next('UNKNOW');
    this.errorCode$.next(null);
    return;
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
  ): Observable<DeviceGetStatus> {
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
    return this.sendSync$(command).pipe(
      tap((status) => {
        if (status !== 'ACK') {
          this.messagesService.error('No se pudo encender el generador.');
        } else {
          this.deviceStatus$.next('ON');
        }
      })
    );
  }

  turnOffSignals$(): Observable<DeviceGetStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STOP);
    return this.sendSync$(command).pipe(
      tap((status) => {
        if (status !== 'ACK') {
          this.messagesService.error('No se pudo apagar el generador.');
        } else {
          this.deviceStatus$.next('OFF');
        }
      }),
    );
  }

  getStatus$(): Observable<DeviceGetStatus> {
    const command: Command = this.commandManager.build(PROTOCOL.DEVICE.GENERATOR.COMMAND.STATUS);
    return this.sendSync$(command);
  }
}