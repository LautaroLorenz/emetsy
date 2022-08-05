import { ReportBodyBuilder } from "./report-builder.model";
import { Report, ReportPageA4, ReportTable, ReportTbody, ReportTd, ReportTr } from "./report.model";


export class ReportContrastTestBuilder extends ReportBodyBuilder {

  private creationDate(): string {
    const now = new Date();
    return now.getDay() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
  }

  override produce(): Report {
    const creationDate = this.creationDate();
    const report = new Report();
    const pageA4 = new ReportPageA4();
    report.pages.push(pageA4);

    const tableHeader = new ReportTable();
    pageA4.add(tableHeader);
    tableHeader.style = 'width:190mm;margin:10mm;border-collapse:collapse;font-family:Roboto;';
    const tbodyHeader = new ReportTbody();
    tableHeader.add(tbodyHeader);

    const trHeader_1 = new ReportTr();
    tbodyHeader.add(trHeader_1);
    const tdHeader_1 = new ReportTd();
    trHeader_1.add(tdHeader_1);
    tdHeader_1.style = 'border-bottom:0.5mm solid black;text-align:right;padding-bottom:3mm;';
    tdHeader_1.text = `<span>Reporte creado&nbsp;${creationDate}<span>`;

    const trHeader_2 = new ReportTr();
    tbodyHeader.add(trHeader_2);
    const tdHeader_2 = new ReportTd();
    trHeader_2.add(tdHeader_2);
    tdHeader_2.style = 'padding-top:8mm;padding-bottom:15mm;text-align:center;';
    tdHeader_2.text = `<img src="./assets/img/logo.png" />`;

    

    return report;
  }

}
