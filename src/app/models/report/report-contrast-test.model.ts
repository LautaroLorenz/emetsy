import { Result, ResultEnum } from "../components/stand-result.model";
import { ReportBuilder } from "./report-builder.model";
import { Report, ReportPageA4, ReportTable, ReportTd, ReportTr } from "./report.model";

export interface ManofacturingInformation {
  serialNumber: string;
  yearOfProduction: number;
}

export interface ReportStand {
  standIndex: number;
  brandModel: string;
  errorValue: number;
  result: Result;
  manofacturingInformation?: ManofacturingInformation;
}
export interface ReportContrastTest {
  reportName: string;
  userName: string;
  maxAllowedError: number;
  executionSeconds: number;
  standsLength: number;
  executionDateString: string;
  stands: ReportStand[];
}

export class ReportContrastTestBuilder extends ReportBuilder {
  private data!: ReportContrastTest;

  constructor() {
    super();
    this.reset();
  }

  private creationDate(): string {
    const now = new Date();
    const day = now.getDay();
    const dd = day < 10 ? '0' + day : day;
    const month = now.getMonth() + 1;
    const mm = month < 10 ? '0' + month : month;
    return dd + "/" + mm + "/" + now.getFullYear();
  }

  private formatTime(seconds: number): string {
    const hour = Math.floor(seconds / 3600);
    const hh = (hour < 10) ? '0' + hour : hour;
    const minute = Math.floor((seconds / 60) % 60);
    const mm = (minute < 10) ? '0' + minute : minute;
    const second = seconds % 60;
    const ss = (second < 10) ? '0' + second : second;
    return (hh || '00') + ':' + (mm || '00') + ':' + (ss || '00');
  }

  reset(): void {
    this.data = {} as ReportContrastTest;
  }

  pathValue(value: Partial<ReportContrastTest>) {
    this.data = {
      ...this.data,
      ...value
    };
  }

  override produce(): Report {
    const creationDate = this.creationDate();
    const report = new Report();
    const pageA4 = new ReportPageA4();
    report.pages.push(pageA4);

    // PRODUCE HEADER TABLE
    {
      const tableHeader = new ReportTable();
      pageA4.add(tableHeader);
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
      td_3.text = this.data.reportName ?? '';
      td_3.class = 'text-700';

      tableHeader.add(tr_1);
      tableHeader.add(tr_2);
      tableHeader.add(tr_3);
      tr_1.add(td_1);
      tr_2.add(td_2);
      tr_3.add(td_3);
    }

    // PRODUCE USER
    {
      const tableUser = new ReportTable();
      pageA4.add(tableUser);
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
    }

    // PRODUCE INFO TABLE
    {
      const tableInfo = new ReportTable();
      pageA4.add(tableInfo);
      tableInfo.style = 'width:190mm;margin:10mm 10mm 10mm 10mm;;border-collapse:collapse;font-family:Roboto;';

      const td_header_style = 'border:0.1mm solid black;text-align:center;padding:1.5mm;background-color:var(--purple-50);border-collapse:collapse;border-bottom:unset;';
      const tr_1 = new ReportTr();
      const td_1 = new ReportTd();
      td_1.style = td_header_style.concat('border-right:unset;');
      td_1.text = 'Error admisible [%]';
      td_1.class = 'w-3';
      const td_2 = new ReportTd();
      td_2.style = td_header_style.concat('border-right:unset;');
      td_2.text = 'Cantidad de puestos';
      td_2.class = 'w-3';
      const td_3 = new ReportTd();
      td_3.style = td_header_style.concat('border-right:unset;');
      td_3.text = 'Tiempo de ejecución';
      td_3.class = 'w-3';
      const td_4 = new ReportTd();
      td_4.style = td_header_style;
      td_4.text = 'Fecha de ejecución';
      td_4.class = 'w-3';

      tableInfo.add(tr_1);
      tr_1.add(td_1);
      tr_1.add(td_2);
      tr_1.add(td_3);
      tr_1.add(td_4);

      const td_info_style = 'border:0.1mm solid black;border-collapse:collapse;padding:1.5mm;background-color:#FFF;'
      const tr_2 = new ReportTr();
      const td_2_1 = new ReportTd();
      td_2_1.style = td_info_style.concat('border-right:unset;text-align:right;');
      td_2_1.text = `${this.data.maxAllowedError ?? '--'}`;
      const td_2_2 = new ReportTd();
      td_2_2.style = td_info_style.concat('border-right:unset;text-align:right;');
      td_2_2.text = `${this.data.standsLength ?? '--'}`;
      const td_2_3 = new ReportTd();
      td_2_3.style = td_info_style.concat('border-right:unset;text-align:center;');
      td_2_3.text = `${this.formatTime(this.data.executionSeconds ?? '--')} Hs`;
      const td_2_4 = new ReportTd();
      td_2_4.style = td_info_style.concat('text-align:center;');
      td_2_4.text = `${this.data.executionDateString ?? '--'} Hs`;

      tableInfo.add(tr_2);
      tr_2.add(td_2_1);
      tr_2.add(td_2_2);
      tr_2.add(td_2_3);
      tr_2.add(td_2_4);
    }

    // PRODUCE STAND RESULT
    {
      const tableStands = new ReportTable();
      pageA4.add(tableStands);
      tableStands.style = 'width:190mm;margin:10mm 10mm 10mm 10mm;;border-collapse:collapse;font-family:Roboto;';

      const td_header_style = 'border:0.1mm solid black;text-align:center;padding:1.5mm;background-color:var(--purple-50);border-collapse:collapse;border-bottom:unset;';
      const tr_1 = new ReportTr();
      const td_1 = new ReportTd();
      td_1.style = td_header_style.concat('border-right:unset;');
      td_1.text = 'Puesto';
      td_1.class = 'w-2';
      const td_2 = new ReportTd();
      td_2.style = td_header_style.concat('border-right:unset;');
      td_2.text = 'Medidor';
      td_2.class = 'w-4';
      const td_3 = new ReportTd();
      td_3.style = td_header_style.concat('border-right:unset;');
      td_3.text = 'Error obtenido [%]';
      td_3.class = 'w-3';
      const td_4 = new ReportTd();
      td_4.style = td_header_style;
      td_4.text = 'Resultado';
      td_4.class = 'w-3';

      tableStands.add(tr_1);
      tr_1.add(td_1);
      tr_1.add(td_2);
      tr_1.add(td_3);
      tr_1.add(td_4);

      const approvedClass = 'text-green-500';
      const disapprovedClass = 'text-red-500';

      if (!this.data.stands) {
        this.data.stands = [];
      }
      for (const [index, stand] of this.data.stands.entries()) {
        const withBorderBottom = index === this.data.stands.length - 1;

        const td_info_style = 'border:0.1mm solid black;border-collapse:collapse;padding:1.5mm;background-color:#FFF;'
        const tr_2 = new ReportTr();
        const td_2_1 = new ReportTd();
        td_2_1.style = td_info_style.concat('border-right:unset;text-align:center;').concat(withBorderBottom ? '' : 'border-bottom:unset;');
        td_2_1.text = `${stand.standIndex}`;
        const td_2_2 = new ReportTd();
        td_2_2.style = td_info_style.concat('border-right:unset;text-align:left;padding:0;').concat(withBorderBottom ? '' : 'border-bottom:unset;');

        // PRODUCE METER INFO
        {
          const tableMeter = new ReportTable();
          tableMeter.style = 'width: 100%;'
          const tr_1 = new ReportTr();
          const td_1 = new ReportTd();
          tableMeter.add(tr_1);
          tr_1.add(td_1);
          td_1.style = 'padding:1.5mm;';
          td_1.text = `Modelo: ${stand.brandModel}`;

          if (stand.manofacturingInformation) {
            const tr_2 = new ReportTr();
            const td_2 = new ReportTd();
            const tr_3 = new ReportTr();
            const td_3 = new ReportTd();
            tr_2.add(td_2);
            tr_3.add(td_3);
            tableMeter.add(tr_2);
            tableMeter.add(tr_3);

            td_2.style = 'border-top: 1px solid black;padding:1.5mm;';
            td_2.text = `NS: ${stand.manofacturingInformation.serialNumber}`;
            td_3.style = 'border-top: 1px solid black;padding:1.5mm;';
            td_3.text = `Año de fabricación: ${stand.manofacturingInformation.yearOfProduction}`;
          }

          td_2_2.text = tableMeter.get();
        }

        const td_2_3 = new ReportTd();
        td_2_3.style = td_info_style.concat('border-right:unset;text-align:right;').concat(withBorderBottom ? '' : 'border-bottom:unset;');
        td_2_3.text = `${stand.errorValue}`;
        const td_2_4 = new ReportTd();
        td_2_4.style = td_info_style.concat('text-align:center;').concat(withBorderBottom ? '' : 'border-bottom:unset;');
        td_2_4.text = `${stand.result === ResultEnum.APPROVED ? 'Aprobado' : 'Desaprobado'}`;
        td_2_4.class = (stand.result === ResultEnum.APPROVED ? approvedClass : disapprovedClass);

        tableStands.add(tr_2);
        tr_2.add(td_2_1);
        tr_2.add(td_2_2);
        tr_2.add(td_2_3);
        tr_2.add(td_2_4);
      }
    }

    return report;
  }

}
