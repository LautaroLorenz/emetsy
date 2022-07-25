import { Injectable } from "@angular/core";
import { catchError, first, from, Observable, throwError } from "rxjs";
import { Command, CompileParams } from "../models";
import { IpcService } from "./ipc.service";
import { MessagesService } from "./messages.service";

@Injectable({
  providedIn: "root"
})
export class CommunicationService {
  
  constructor(
    private readonly ipcService: IpcService,
    private readonly messagesService: MessagesService
  ) { }

  connectWithHardware(): void {
    from(this.ipcService.invoke('connect-with-hardware', {
      productId: CompileParams.USB.PRODUCT_ID, 
      vendorId: CompileParams.USB.VENDOR_ID 
    })).pipe(
      first(),
      catchError((e) => {
        this.messagesService.error('No se pudo conectar con el hardware');
        return throwError(() => new Error(e));
      }),
    ).subscribe();
  }

  send(command: Command): Observable<void> {
    return from(this.ipcService.invoke('send-command', { command }));
  }
}
