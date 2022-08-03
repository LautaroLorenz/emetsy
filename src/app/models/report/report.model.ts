export class Report {
  public parts: string[] = [];

  public listParts(): void {
    console.log(`Product parts: ${this.parts.join(', ')}\n`);
  }
}

export interface ReportBuilder {
  produceHeader(): void;
  produceBody(): void;
  produceFooter(): void;
}

export class ReportBuilderHTML implements ReportBuilder {
  private report!: Report;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.report = new Report();
  }

  public produceHeader(): void {
    this.report.parts.push('<span>Header<span>');
  }

  public produceBody(): void {
    this.report.parts.push('<span>Body<span>');
  }

  public produceFooter(): void {
    this.report.parts.push('<span>Footer<span>');
  }

  public getProduct(): Report {
    const result = this.report;
    this.reset();
    return result;
  }
}
