import { Component, OnInit } from '@angular/core';
import { TerminalService } from 'primeng/terminal';
import { IpcService } from "../../services/ipc.service";

@Component({
  selector: 'app-command-line',
  templateUrl: './command-line.component.html',
  providers: [TerminalService],
  styleUrls: ['./command-line.component.scss']
})
export class CommandLineComponent implements OnInit {

  constructor(
    private terminalService: TerminalService,
    private readonly ipcService: IpcService,
  ) {
    this.terminalService.commandHandler.subscribe(this.handleCommands);
  }

  ngOnInit(): void {
  }

  handleCommands = (input: string) => {
    const [command, param] = input.split(' ');
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[012])\d{2}$/;

    if (command !== 'log') {
      this.terminalService.sendResponse('Comando no reconocido: ' + command);
    }
    if (command === 'log' && !param?.match(dateRegex)) {
      this.terminalService.sendResponse('Debe especificar la fecha con formato ddmmaa. Ejemplo de ejecución: log 310722');
    }
    if (command === 'log' && param?.match(dateRegex)) {
      this.handleLogCommand(param);
    }
  }

  handleLogCommand(param: string) {
    this.ipcService.invoke("get-log", param).then((value) => {
      this.terminalService.sendResponse(value);
    });
    this.terminalService.sendResponse('Presione enter para ver el log');
  }

}

