import { ReportBodyBuilder} from "./report-builder.model";
import { Report, ReportPageA4, ReportTable, ReportTbody, ReportTd, ReportTr } from "./report.model";


export class ReportContrastTestBuilder extends ReportBodyBuilder {

  override produce(): Report {
    const report = new Report();

    const pageA4_1 = new ReportPageA4();
    const pageA4_2 = new ReportPageA4();
    const table = new ReportTable();
    const tbody = new ReportTbody();
    const tr = new ReportTr();
    const tr2 = new ReportTr();
    const td1 = new ReportTd();
    const td2 = new ReportTd();

    table.style = 'background-color:pink;';
    td1.text = 'hola';
    td2.text = 'mundo';

    table.add(tbody);
    tbody.add(tr);
    tbody.add(tr2);
    tr.add(td1);
    tr.add(td2);
    tr2.add(td2);

    pageA4_1.add(table);
    pageA4_2.add(table);

    report.pages.push(pageA4_1);
    report.pages.push(pageA4_2);

    return report;
  }

}
