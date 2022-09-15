import { Result, ResultEnum } from "../components/stand-result.model";
import { ReportBuilder } from "./report-builder.model";
import { ReportTable, ReportTd, ReportTr } from "./report.model";


export interface ReportStand {
  standIndex: number;
  brandModel: string | null;
  errorValue: number | null;
  result: Result | null;
  serialNumber: string;
  yearOfProduction: number;
}

export interface ReportContrastTest {
  reportName: string;
  maxAllowedError: number;
  executionSeconds: number;
  standsLength: number;
  executionDateString: string;
  stands: ReportStand[];
}

export class ReportContrastTestBuilder extends ReportBuilder {
  override data: ReportContrastTest = {} as ReportContrastTest;
  override requireAnEmptyPage: boolean = true;

  constructor() {
    super();
    this.reset();
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

  override patchValue(value: Partial<ReportContrastTest>) {
    this.data = {
      ...this.data,
      ...value
    };
  }

  override produce(): ReportTable {
    const table_style = 'width:190mm;margin:10mm 10mm 10mm 10mm;;border-collapse:collapse;font-family:Roboto;';
    const td_header_style = 'border:0.1mm solid black;text-align:center;padding:1.5mm;background-color:var(--purple-50);border-collapse:collapse;border-bottom:unset;';
    const tableEssayInfo = new ReportTable();
    const tableEssayResult = new ReportTable();
    const unionTable = new ReportTable();

    tableEssayInfo.style = table_style.concat('margin-bottom:unset;');
    tableEssayResult.style = table_style.concat('margin-top:5mm;');

    // ESSAY PARAMETERS INFORMATION
    {
      const tr_0 = new ReportTr();
      const td_0 = new ReportTd();
      td_0.style = td_header_style;
      td_0.text = this.data.reportName;
      td_0.colspan = 4;

      tableEssayInfo.add(tr_0);
      tr_0.add(td_0);

      const tr_1 = new ReportTr();
      const td_1 = new ReportTd();
      td_1.style = td_header_style.concat('border-right:unset;');
      td_1.text = 'Error admisible +/- [%]';
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

      tableEssayInfo.add(tr_1);
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

      tableEssayInfo.add(tr_2);
      tr_2.add(td_2_1);
      tr_2.add(td_2_2);
      tr_2.add(td_2_3);
      tr_2.add(td_2_4);
    }

    // STAND RESULT
    {
      const tr_3 = new ReportTr();
      const td_3_1 = new ReportTd();
      td_3_1.style = td_header_style.concat('border-right:unset;');
      td_3_1.text = 'Puesto';
      td_3_1.class = 'w-2';
      const td_3_2 = new ReportTd();
      td_3_2.style = td_header_style.concat('border-right:unset;');
      td_3_2.text = 'Medidor';
      td_3_2.class = 'w-4';
      const td_3_3 = new ReportTd();
      td_3_3.style = td_header_style.concat('border-right:unset;');
      td_3_3.text = 'Error obtenido [%]';
      td_3_3.class = 'w-3';
      const td_3_4 = new ReportTd();
      td_3_4.style = td_header_style;
      td_3_4.text = 'Resultado';
      td_3_4.class = 'w-3';

      tableEssayResult.add(tr_3);
      tr_3.add(td_3_1);
      tr_3.add(td_3_2);
      tr_3.add(td_3_3);
      tr_3.add(td_3_4);

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
          const tr_2 = new ReportTr();
          const td_2 = new ReportTd();
          const tr_3 = new ReportTr();
          const td_3 = new ReportTd();
          tr_1.add(td_1);
          tr_2.add(td_2);
          tr_3.add(td_3);
          tableMeter.add(tr_2);
          tableMeter.add(tr_3);

          td_1.style = 'padding:1.5mm;';
          td_1.text = `Modelo: ${stand.brandModel}`;
          td_2.style = 'border-top: 1px solid black;padding:1.5mm;';
          td_2.text = `NS: ${stand.serialNumber}`;
          td_3.style = 'border-top: 1px solid black;padding:1.5mm;';
          td_3.text = `Año de fabricación: ${stand.yearOfProduction}`;

          td_2_2.text = tableMeter.get();
        }

        const td_2_3 = new ReportTd();
        td_2_3.style = td_info_style.concat('border-right:unset;text-align:right;').concat(withBorderBottom ? '' : 'border-bottom:unset;');
        td_2_3.text = `${stand.errorValue}`;
        const td_2_4 = new ReportTd();
        td_2_4.style = td_info_style.concat('text-align:center;').concat(withBorderBottom ? '' : 'border-bottom:unset;');
        td_2_4.text = `${stand.result === ResultEnum.APPROVED ? 'Aprobado' : 'Desaprobado'}`;
        td_2_4.class = (stand.result === ResultEnum.APPROVED ? approvedClass : disapprovedClass);

        tableEssayResult.add(tr_2);
        tr_2.add(td_2_1);
        tr_2.add(td_2_2);
        tr_2.add(td_2_3);
        tr_2.add(td_2_4);
      }
    }

    // UNION ALL TABLES
    {
      const tr_1 = new ReportTr();
      const td_1 = new ReportTd();

      unionTable.add(tr_1);
      tr_1.add(td_1);
      td_1.text = tableEssayInfo.get();

      const tr_2 = new ReportTr();
      const td_2 = new ReportTd();

      unionTable.add(tr_2);
      tr_2.add(td_2);
      td_2.text = tableEssayResult.get();
    }

    return unionTable;
  }

}
