import { ReportBodyBuilder, ReportTable, ReportTbody, ReportTd, ReportTr } from "./report-body-builder.model";
import { ReportBody } from "./report-body.model";

export class ReportContrastTestBuilder extends ReportBodyBuilder {

  override produce(): ReportBody {
    const reportBody = new ReportBody();

    const table = new ReportTable();
    const tbody = new ReportTbody();
    const tr = new ReportTr();
    const tr2 = new ReportTr();
    const td1 = new ReportTd();
    const td2 = new ReportTd();

    table.style = 'border-collapse:collapse;width:210mm;';

    td1.style = 'background-color:yellow;width:40mm;';
    td1.text = 'hola';

    td2.style = 'background-color:orange;';
    td2.text = 'mundo';

    table.add(tbody);
    tbody.add(tr);
    tbody.add(tr2);
    tr.add(td1);
    tr.add(td2);
    tr2.add(td2);

    reportBody.parts.push(table.get());

    return reportBody;
  }

}
