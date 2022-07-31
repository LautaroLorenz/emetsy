import { PROTOCOL } from "./protocol.model";

export type Command = string;

export class CommandManager {
  readonly divider = PROTOCOL.COMMAND.DIVIDER;
  readonly start = PROTOCOL.COMMAND.START;
  readonly end = PROTOCOL.COMMAND.END;
  readonly deviceFrom: string;
  readonly deviceTo: string;

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
    for (const arg of args) {
      commandBlocks.push(arg);
    }
    commandBlocks.push(this.end);
    const checkSum = this.calculateChecksum(commandBlocks.join(this.divider));
    commandBlocks.push(checkSum);
    return commandBlocks.join(this.divider);
  }

  formatNumber(value: number, start: string, zeros: number, withSignal: boolean): string {
    const formated = ''.concat(start);
    let stringValue = (value < 0 ? -value : value).toString();
    while (stringValue.length < zeros) {
      stringValue = '0'.concat(stringValue);
    }
    const signal = withSignal ? ((value < 0) ? '-' : '+') : '';
    return formated.concat(signal).concat(stringValue);
  }

  formatString(value: string, zeros: number, commaDigits: number): number {
    if(value === undefined) {
      return 0;
    }
    const noZerosValue = value.slice(zeros);
    const digits = noZerosValue.slice(0, -commaDigits);
    const commas = noZerosValue.slice(-commaDigits);
    const resultAsString = digits.concat('.').concat(commas);
    const result = Number(resultAsString);
    return isNaN(result) ? 0 : result;
  }

  /**
   * TODO: validar checksum
   */
  isValid(command: Command): boolean {
    return true;
  }

  isForMe(command: Command): boolean {
    const blocks = command.split(PROTOCOL.COMMAND.DIVIDER);
    return blocks.some((block) => block === this.deviceTo);
  }
}
