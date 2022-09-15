import { ReportBuilder } from "./report-builder.model";
import { ReportTable, ReportTd, ReportTr } from "./report.model";

export class ReportHeaderBuilder extends ReportBuilder {

  private creationDate(): string {
    const now = new Date();
    const day = now.getDate();
    const dd = day < 10 ? '0' + day : day;
    const month = now.getMonth() + 1;
    const mm = month < 10 ? '0' + month : month;
    return dd + "/" + mm + "/" + now.getFullYear();
  }

  override produce(): ReportTable {
    const creationDate = this.creationDate();

    const tableHeader = new ReportTable();
    tableHeader.style = 'width:190mm;margin:10mm;border-collapse:collapse;font-family:Roboto;';

    const tr_1 = new ReportTr();
    const td_1 = new ReportTd();
    td_1.style = 'border-bottom:0.5mm solid var(--purple-500);text-align:right;padding-bottom:3mm;';
    td_1.text = `<span>Reporte creado&nbsp;${creationDate}<span>`;

    const tr_2 = new ReportTr();
    const td_2 = new ReportTd();
    td_2.style = 'padding-top:16mm;text-align:center;';
    td_2.text = `<img src="./assets/img/logo.png" />`;

    const tr_3 = new ReportTr();
    const td_3 = new ReportTd();
    td_3.style = 'padding-top:2mm;font-size:10mm;text-align:center;';
    td_3.text = this.data.name ?? '';
    td_3.class = 'text-700';

    tableHeader.add(tr_1);
    tableHeader.add(tr_2);
    tableHeader.add(tr_3);
    tr_1.add(td_1);
    tr_2.add(td_2);
    tr_3.add(td_3);

    return tableHeader;
  }

}