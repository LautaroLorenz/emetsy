import { Report } from "./report.model";

export class ReportBuilder {
  data: any = {};

  produce(): Report {
    return new Report();
  }
}
