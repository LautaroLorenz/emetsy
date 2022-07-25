import { PROTOCOL } from "./protocol.model";

export type Command = string;

export class CommandBuilder {
  private divider = PROTOCOL.COMMAND.DIVIDER;
  private start = PROTOCOL.COMMAND.START;
  private end = PROTOCOL.COMMAND.END;
  private deviceFrom: string;
  private deviceTo: string;

  constructor(deviceFrom: string, deviceTo: string) {
    this.deviceFrom = deviceFrom;
    this.deviceTo = deviceTo;
  }

  private calculateChecksum(partialCommand: Command): string {
    return 'X';
  }

  build(...args: string[]): Command {
    const commandBlocks = [];
    commandBlocks.push(this.start);
    commandBlocks.push(this.deviceFrom);
    commandBlocks.push(this.deviceTo);
    for(const arg of args) {
      commandBlocks.push(arg);
    }
    commandBlocks.push(this.end);
    const checkSum = this.calculateChecksum(commandBlocks.join(this.divider));
    commandBlocks.push(checkSum);
    return commandBlocks.join(this.divider);
  }
}
