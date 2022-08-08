import { Report } from "./report.model";

export class ReportBuilder {
  data: any = {};

  pathValue(value: Partial<any>) {
    this.data = {
      ...this.data,
      ...value
    };
  }

  produce(): Report {
    return new Report();
  }
}
