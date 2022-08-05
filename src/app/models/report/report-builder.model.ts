import { Report } from "./report.model";

export class ReportBodyBuilder {
  produce(): Report {
    return new Report();
  }
}
