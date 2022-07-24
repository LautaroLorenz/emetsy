import { Injectable } from "@angular/core";
import { Command, CommandBuilder } from "src/app/models";
import { CommunicationService } from "../communication.service";

@Injectable({
  providedIn: "root"
})
export class GeneratorService {

  private readonly commandBuilder: CommandBuilder;
  private readonly deviceFrom = 'PCS';
  private readonly deviceTo = 'GDR';

  constructor(
    private readonly communicationService: CommunicationService
  ) {
    this.commandBuilder = new CommandBuilder(this.deviceFrom, this.deviceTo);
  }

  turnOn(): void {
    const command: Command = this.commandBuilder.build(); // TODO: args
    // TODO: send command
  }
}