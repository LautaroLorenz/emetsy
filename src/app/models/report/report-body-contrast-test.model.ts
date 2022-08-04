import { ReportBodyBuilder } from "./report-body-builder.model";
import { ReportBody } from "./report-body.model";

export class ReportContrastTestBuilder extends ReportBodyBuilder {

  override produce(): ReportBody {
    const reportBody = new ReportBody();
    reportBody.parts.push('<span>Body<span>');
    return reportBody;
  }
  
}
