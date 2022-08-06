import { Report } from "./report.model";

export class ReportBuilder {
  produce(): Report {
    return new Report();
  }
}
