import { ReportTable } from "./report.model";

export class ReportBuilder {
  data: any = {};
  requireAnEmptyPage: boolean = false;

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
