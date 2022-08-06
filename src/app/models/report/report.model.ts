export class Report {
  public pages: ReportPageA4[] = [];

  toString(): string {
    return this.pages.map((page) => page.get()).join("");
  }
}
export class ReportPageA4 {
  private _table: ReportTable[] = [];

  add(table: ReportTable): ReportTable[] {
    this._table.push(table);
    return this._table;
  }

  get(): string {
    const content = this._table.map((table) => table.get()).join("");
    return `<div class="page" style="width:210mm;height:297mm;">`.concat(content).concat('</div>');
  }
}

export class ReportTable {
  private _tr: ReportTr[] = [];
  public style: string = '';
  public attributes: string = '';

  add(tr: ReportTr): ReportTr[] {
    this._tr.push(tr);
    return this._tr;
  }

  get(): string {
    const content = this._tr.map((tr) => tr.get()).join("");
    return `<table ${this.attributes} style="${this.style}">`.concat(content).concat('</table>');
  }
}
export class ReportTr {
  private _td: ReportTd[] = [];
  public style: string = '';

  add(td: ReportTd): ReportTd[] {
    this._td.push(td);
    return this._td;
  }

  get(): string {
    const content = this._td.map((td) => td.get()).join("");
    return `<tr style="${this.style}">`.concat(content).concat('</tr>');
  }
}


export class ReportTd {
  public text: string = '';
  public style: string = '';
  public class: string = '';

  get(): string {
    return `<td class="${this.class}" style="${this.style}">`.concat(this.text).concat('</td>');
  }
}