import { DecimalPipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Command, CommandBuilder, PROTOCOL } from "src/app/models";
import { CommunicationService } from "../communication.service";

@Injectable({
  providedIn: "root"
})
export class GeneratorService {

  private readonly commandBuilder: CommandBuilder;
  private readonly deviceFrom = PROTOCOL.SOFTWARE.DEVICE_NAME;
  private readonly deviceTo = PROTOCOL.GENERATOR.DEVICE_NAME;

  constructor(
    private readonly communicationService: CommunicationService,
    private readonly decimalPipe: DecimalPipe,
  ) {
    this.commandBuilder = new CommandBuilder(this.deviceFrom, this.deviceTo);
    communicationService.connectWithHardware();
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

  turnOn(
    voltageU1: number,
    voltageU2: number,
    voltageU3: number,
    currentI1: number,
    currentI2: number,
    currentI3: number,
    anglePhi1: number,
    anglePhi2: number,
    anglePhi3: number,
  ): Observable<void> {
    const command: Command = this.commandBuilder.build(
      PROTOCOL.GENERATOR.COMMAND.START,
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
    return this.communicationService.send(command);
  }

  turnOff(): Observable<void> {
    const command: Command = this.commandBuilder.build(PROTOCOL.GENERATOR.COMMAND.STOP);
    return this.communicationService.send(command);
  }

  getState(): Observable<void> {
    const command: Command = this.commandBuilder.build(PROTOCOL.GENERATOR.COMMAND.STATUS);
    return this.communicationService.send(command);
  }
}