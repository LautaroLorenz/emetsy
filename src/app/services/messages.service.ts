import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";


@Injectable({
  providedIn: "root"
})
export class MessagesService {
  private messageLifeMs = 5000;

  constructor(private messageService: MessageService) { }

  public info(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: message,
      life: this.messageLifeMs
    });
  }

  public warn(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Aviso',
      detail: message,
      life: this.messageLifeMs
    });
  }

  public success(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Realizado',
      detail: message,
      life: this.messageLifeMs
    });
  }

  public error(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}