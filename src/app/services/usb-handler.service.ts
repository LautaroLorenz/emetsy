import { Injectable } from "@angular/core";
import { BehaviorSubject, first, from, Observable, Subject, take, tap } from "rxjs";
import { Command, CompileParams, PROTOCOL } from "../models";
import { IpcService } from "./ipc.service";
import { MessagesService } from "./messages.service";


@Injectable({
  providedIn: "root"
})
export class UsbHandlerService {

  readonly connected$: BehaviorSubject<boolean>;
  readonly getCommand$: Subject<Command>;

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
  }

  private isConnected(): Observable<boolean> {
    return from(this.ipcService.invoke('is-usb-serial-port-connected'));
  }

  private startChekingConnectionLoop(skipConnectedValidation: boolean): void {
    if(!this.connected$.value && skipConnectedValidation === false) {
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
        tap((isConnected) => {
          if (isConnected !== this.connected$.value) {
            this.connected$.next(isConnected);
            if (!isConnected) {
              this.disconnect().pipe(take(1)).subscribe();
            }
          }
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
    if(!this.connected$.value && skipConnectedValidation === false) {
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
          this.disconnect();
        }
      }),
    );
  }

  private startPosttingCommandLoop(skipConnectedValidation: boolean): void {
    if(!this.connected$.value && skipConnectedValidation === false) {
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

  connect(): Observable<boolean> {
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

  disconnect(): Observable<boolean> {
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

  send(command: Command): void {
    if(this.postCommandQueue === null) {
      this.postCommandQueue = [];
    }
    this.postCommandQueue.unshift(command);
    return;
  }
}
