import { ReportBuilder } from "./report-builder.model";
import { ReportTable, ReportTd, ReportTr } from "./report.model";

export interface ReportUser {
  userName: string;
}

export class ReportUserIdentificationBuilder extends ReportBuilder {
  override data: ReportUser = {} as ReportUser;

  constructor() {
    super();
    this.reset();
  }

  reset(): void {
    this.data = {} as ReportUser;
  }

  override patchValue(value: Partial<ReportUser>) {
    this.data = {
      ...this.data,
      ...value
    };
  }

  override produce(): ReportTable {
    const tableUser = new ReportTable();
    tableUser.style = 'width:190mm;margin:16mm 10mm 10mm 10mm;border-collapse:collapse;font-family:Roboto;';

    const td_header_style = 'border:0.1mm solid black;text-align:center;padding:1.5mm;border-collapse:collapse;';
    const tr_1 = new ReportTr();
    const td_1 = new ReportTd();
    td_1.style = td_header_style.concat('background-color:var(--purple-50);text-align:left;border-bottom:unset;');
    td_1.text = 'Responsable de ejecución';
    td_1.class = 'w-6';

    const tr_2 = new ReportTr();
    const td_2 = new ReportTd();
    td_2.style = td_header_style.concat('background-color:#FFF;text-align:left;');
    td_2.text = this.data.userName ?? '--';
    td_2.class = 'w-6';

    const td_fill = new ReportTd();
    td_fill.class = 'w-6';

    tableUser.add(tr_1);
    tableUser.add(tr_2);
    tr_1.add(td_1);
    tr_1.add(td_fill);
    tr_2.add(td_2);
    tr_2.add(td_fill);

    return tableUser;
  }

}
