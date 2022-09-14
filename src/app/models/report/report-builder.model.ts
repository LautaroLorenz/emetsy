import { ReportTable } from "./report.model";

export class ReportBuilder {
  data: any = {};

  patchValue(value: Partial<any>) {
    this.data = {
      ...this.data,
      ...value
    };
  }

  produce(): ReportTable {
    return new ReportTable();
  }
}
