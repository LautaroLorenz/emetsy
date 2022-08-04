import { ReportBody } from "./report-body.model";

export class ReportBodyBuilder {
  produce(): ReportBody {
    return new ReportBody();
  }
}
