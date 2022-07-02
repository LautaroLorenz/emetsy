import { Injectable } from "@angular/core";
import { IpcService } from "./ipc.service";


@Injectable({
  providedIn: "root"
})
export class LogService {

    constructor(private ipcService: IpcService) { }

    addLog(mode: 'error' | 'warn' | 'info' | 'debug', message: string | object) {
        return this.ipcService.send('log', {mode, message});
    }
}