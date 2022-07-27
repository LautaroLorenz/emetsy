import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, first, from, map, Observable, of, Subject, switchMap, take, tap, timeout } from "rxjs";
import { Command, CommandManager, CompileParams, PROTOCOL, ResponseStatus, ResponseStatusEnum } from "../models";
import { IpcService } from "./ipc.service";
import { MessagesService } from "./messages.service";


@Injectable({
  providedIn: "root"
})
export class UsbHandlerService {

  readonly connected$: BehaviorSubject<boolean>;
  readonly getCommand$: Subject<Command>;
  readonly sendAndWaitInProgress$: BehaviorSubject<boolean>;

  private readonly productId = CompileParams.USB.PRODUCT_ID;
  private readonly vendorId = CompileParams.USB.VENDOR_ID;
  private isCheckingConnectionLoopActive: boolean = false;
  private checkingConnectionLoopTimeout: any = undefined;
  private isGettingCommandLoopActive: boolean = false;
  private gettingCommandLoopTimeout: any = undefined;
  private isPosttingCommandLoopActive: boolean = false;
  private posttingCommandLoopTimeout: any = undefined;
  private postCommandQueue: Command[] | null = null;

  constructor(
    private readonly ipcService: IpcService,
    private readonly messagesService: MessagesService,
  ) {
    this.connected$ = new BehaviorSubject<boolean>(false);
    this.getCommand$ = new Subject<Command>();
    this.sendAndWaitInProgress$ = new BehaviorSubject<boolean>(false);
  }

  private isConnected(): Observable<boolean> {
    return from(this.ipcService.invoke('is-usb-serial-port-connected'));
  }

  private startChekingConnectionLoop(skipConnectedValidation: boolean): void {
    if (!this.connected$.value && skipConnectedValidation === false) {
      return;
    }
    if (!this.isCheckingConnectionLoopActive) {
      return;
    }
    if (this.checkingConnectionLoopTimeout) {
      clearTimeout(this.checkingConnectionLoopTimeout);
    }
    this.checkingConnectionLoopTimeout = setTimeout(() => {
      this.isConnected().pipe(
        first(),
        switchMap((isConnected) => {
          if (isConnected !== this.connected$.value) {
            this.connected$.next(isConnected);
            if (!isConnected) {
              return this.disconnect$().pipe(take(1));
            }
          }
          return of(true);
        }),
        tap(() => this.startChekingConnectionLoop(false)),
      ).subscribe();
    }, PROTOCOL.TIME.LOOP.CHECK_IS_CONNECTED);
    return;
  }

  private stopChekingConnectionLoop(): void {
    this.isCheckingConnectionLoopActive = false;
    if (this.checkingConnectionLoopTimeout) {
      clearTimeout(this.checkingConnectionLoopTimeout);
    }
  }

  private getCommand(): Observable<Command | false> {
    return from(this.ipcService.invoke('get-command'));
  }

  private startGettingCommandLoop(skipConnectedValidation: boolean): void {
    if (!this.connected$.value && skipConnectedValidation === false) {
      return;
    }
    if (!this.isGettingCommandLoopActive) {
      return;
    }
    if (this.gettingCommandLoopTimeout) {
      clearTimeout(this.gettingCommandLoopTimeout);
    }
    this.gettingCommandLoopTimeout = setTimeout(() => {
      this.getCommand().pipe(
        first(),
        tap((command) => {
          if (command !== false) {
            this.getCommand$.next(command);
          }
        }),
        tap(() => this.startGettingCommandLoop(false)),
      ).subscribe();
    }, PROTOCOL.TIME.LOOP.GET_COMMAND);
    return;
  }

  private stopGettingCommandLoop(): void {
    this.isGettingCommandLoopActive = false;
    if (this.gettingCommandLoopTimeout) {
      clearTimeout(this.gettingCommandLoopTimeout);
    }
  }

  private postCommand(command: Command): Observable<boolean> {
    return from(this.ipcService.invoke('post-command', { command })).pipe(
      tap((coludBeSent) => {
        if (!coludBeSent) {
          this.messagesService.error('Error de comunicación con el hardware.');
        }
      }),
      switchMap((coludBeSent) => {
        if (coludBeSent) {
          return of(true);
        }
        return this.disconnect$().pipe(take(1));
      })
    );
  }

  private startPosttingCommandLoop(skipConnectedValidation: boolean): void {
    if (!this.connected$.value && skipConnectedValidation === false) {
      return;
    }
    if (!this.isPosttingCommandLoopActive) {
      return;
    }
    if (this.posttingCommandLoopTimeout) {
      clearTimeout(this.posttingCommandLoopTimeout);
    }
    this.posttingCommandLoopTimeout = setTimeout(() => {
      if (this.postCommandQueue === null) {
        this.startPosttingCommandLoop(false);
        return;
      }
      if (this.postCommandQueue.length === 0) {
        this.startPosttingCommandLoop(false);
        return;
      }
      const command = this.postCommandQueue.pop();
      this.postCommand(command!).pipe(
        first(),
        tap(() => this.startPosttingCommandLoop(false)),
      ).subscribe();
    }, PROTOCOL.TIME.LOOP.POST_COMMAND);
    return;
  }

  private stopPosttingCommandLoop(): void {
    this.isPosttingCommandLoopActive = false;
    if (this.posttingCommandLoopTimeout) {
      clearTimeout(this.posttingCommandLoopTimeout);
    }
  }

  private send(command: Command): void {
    if (this.postCommandQueue === null) {
      this.postCommandQueue = [];
    }
    this.postCommandQueue.unshift(command);
    return;
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

  connect$(): Observable<boolean> {
    return from(this.ipcService.invoke('open-usb-serial-port', {
      productId: this.productId,
      vendorId: this.vendorId
    })).pipe(
      tap((isOpen) => {
        if (!isOpen) {
          this.messagesService.error('Error de conexión con el hardware. Asegurece de que el dispositivo USB este correctamente conectado a la computadora.');
        }
      }),
      tap((isOpen) => {
        if (isOpen) {
          this.postCommandQueue = [];
          this.isCheckingConnectionLoopActive = true;
          this.startChekingConnectionLoop(isOpen);
          this.isGettingCommandLoopActive = true;
          this.startGettingCommandLoop(isOpen);
          this.isPosttingCommandLoopActive = true;
          this.startPosttingCommandLoop(isOpen);
        }
      }),
      tap((isOpen) => this.connected$.next(isOpen)),
    );
  }

  disconnect$(): Observable<boolean> {
    return from(this.ipcService.invoke('close-usb-serial-port')).pipe(
      tap((isClose) => {
        if (!isClose) {
          this.messagesService.error('Error de conexión con el hardware. No se pudo cerrar la conexión.');
        }
      }),
      tap((isClose) => {
        if (isClose) {
          this.postCommandQueue = null;
          this.stopChekingConnectionLoop();
          this.stopGettingCommandLoop();
          this.stopPosttingCommandLoop();
        }
      }),
      tap((isClose) => this.connected$.next(!isClose)),
    );
  }

  sendAndWaitAsync$(command: Command, commandManager: CommandManager): Observable<{ status: ResponseStatus, errorCode: number | null }> {
    return of(this.sendAndWaitInProgress$.next(true)).pipe(
      take(1),
      tap(() => this.send(command)),
      switchMap(() => this.getCommand$.pipe(
        filter((command) => commandManager.isForMe(command)),
        take(1),
        timeout({
          each: PROTOCOL.TIME.WAITING_RESPONSE_TIMEOUT,
          with: () => of(ResponseStatusEnum.TIMEOUT),
        }),
        map((command) => {
          let status: ResponseStatus;
          let errorCode: number | null = null;
          if (this.isAck(command)) {
            status = ResponseStatusEnum.ACK;
          } else if (this.isError(command)) {
            errorCode = this.getErrorCode(command);
            status = ResponseStatusEnum.ERROR;
          } else if (command === ResponseStatusEnum.TIMEOUT) {
            status = ResponseStatusEnum.TIMEOUT;
          } else {
            status = ResponseStatusEnum.UNKNOW;
          }
          return {
            status,
            errorCode
          };
        }),
        tap(() => this.sendAndWaitInProgress$.next(false)),
      )),
    );
  }

}
