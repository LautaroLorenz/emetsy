export type Command = string;

export class CommandBuilder {
  private divider = '|';
  private start = 'B';
  private end = 'E';
  private deviceFrom: string;
  private deviceTo: string;

  constructor(deviceFrom: string, deviceTo: string) {
    this.deviceFrom = deviceFrom;
    this.deviceTo = deviceTo;
  }

  build(...args: string[]): Command {
    return '';
  }

  private calculateChecksum(): number {
    return 0;
  }
}
