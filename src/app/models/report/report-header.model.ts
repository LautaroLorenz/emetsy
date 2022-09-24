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
    tr_1.style = 'border-bottom:0.5mm solid var(--purple-500);';
    const td_1_1 = new ReportTd();
    const td_1_2 = new ReportTd();
    const td_1_3 = new ReportTd();
    const td_1_style = 'padding-bottom:3mm;width:33.33%;'
    td_1_1.style = td_1_style.concat('text-align:left;');
    td_1_1.text = `<span>Página&nbsp;${this.data?.page?.number}/${this.data?.page?.total}<span>`;
    td_1_2.style = td_1_style.concat('text-align:center;');
    td_1_2.text = `<span>Creado&nbsp;${creationDate}<span>`;
    td_1_3.style = td_1_style.concat('text-align:right;');
    td_1_3.text = `<span>Reporte Nº&nbsp;${this.data.reportNumber}<span>`;

    const tr_2 = new ReportTr();
    const td_2_1 = new ReportTd();
    td_2_1.style = 'padding-top:16mm;text-align:center;';
    td_2_1.text = `<img src="./assets/img/logo.png" />`;
    td_2_1.colspan = 3;

    const tr_3 = new ReportTr();
    const td_3_1 = new ReportTd();
    td_3_1.style = 'padding-top:2mm;font-size:10mm;text-align:center;';
    td_3_1.text = this.data.name ?? '';
    td_3_1.class = 'text-700';
    td_3_1.colspan = 3;

    tableHeader.add(tr_1);
    tableHeader.add(tr_2);
    tableHeader.add(tr_3);
    tr_1.add(td_1_1);
    tr_1.add(td_1_2);
    tr_1.add(td_1_3);
    tr_2.add(td_2_1);
    tr_3.add(td_3_1);

    return tableHeader;
  }

}