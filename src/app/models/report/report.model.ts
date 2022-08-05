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
  private _tbody: ReportTbody[] = [];
  public style: string = '';

  add(tbody: ReportTbody): ReportTbody[] {
    this._tbody.push(tbody);
    return this._tbody;
  }

  get(): string {
    const content = this._tbody.map((tbody) => tbody.get()).join("");
    return `<table style="${this.style}">`.concat(content).concat('</table>');
  }
}

export class ReportTbody {
  private _tr: ReportTr[] = [];

  add(tr: ReportTr): ReportTr[] {
    this._tr.push(tr);
    return this._tr;
  }

  get(): string {
    const content = this._tr.map((tr) => tr.get()).join("");
    return `<tbody>`.concat(content).concat('</tbody>');
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

  get(): string {
    return `<td style="${this.style}">`.concat(this.text).concat('</td>');
  }
}