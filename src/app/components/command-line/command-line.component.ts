import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Terminal, TerminalService } from 'primeng/terminal';
import { ReplaySubject, takeUntil } from 'rxjs';
import { IpcService } from "../../services/ipc.service";

@Component({
  selector: 'app-command-line',
  templateUrl: './command-line.component.html',
  providers: [TerminalService],
  styleUrls: ['./command-line.component.scss']
})
export class CommandLineComponent implements OnDestroy {


  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  @ViewChild('terminal', { static: true }) terminal!: Terminal;

  constructor(
    private terminalService: TerminalService,
    private readonly ipcService: IpcService,
  ) {
    this.terminalService.commandHandler
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(this.handleCommands);
  }

  handleCommands = (input: string) => {
    const [command, param] = input.split(' ');
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{4}$/;

    if (command !== 'log') {
      this.terminalService.sendResponse('Comando no reconocido. Para ver los logs utilice log 05112022');
    }
    if (command === 'log' && !param?.match(dateRegex)) {
      this.terminalService.sendResponse('Debe especificar la fecha con formato ddmmaa. Ejemplo de ejecución: log 31072022');
    }
    if (command === 'log' && param?.match(dateRegex)) {
      this.handleLogCommand(param);
    }
  }

  handleLogCommand(param: string) {
    this.ipcService.invoke("get-log", param).then((value) => {
      this.terminalService.sendResponse(value);
      this.terminal.cd.detectChanges(); // Force primeng/terminal to detect an async response
    });
    this.terminalService.sendResponse('Cargando...'); // Sync response will be replaced with async response at change detection
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}

