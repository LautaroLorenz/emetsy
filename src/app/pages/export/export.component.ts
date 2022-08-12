import { Component } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Brand, BrandDbTableContext, EssayTemplate, EssayTemplateDbTableContext, EssayTemplateStep, EssayTemplateStepDbTableContext, ExportTable, History, HistoryDbTableContext, Meter, MeterDbTableContext, Static, StaticDbTableContext, User, UserDbTableContext } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import * as JSZip from 'jszip';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  readonly title: string = 'Exportar';
  readonly tables: ExportTable[];
  readonly exporting$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly brandDbService: DatabaseService<Brand>,
    private readonly userDbService: DatabaseService<User>,
    private readonly meterDbService: DatabaseService<Meter>,
    private readonly essayTemplateDbService: DatabaseService<EssayTemplate>,
    private readonly essayTemplateStepDbService: DatabaseService<EssayTemplateStep>,
    private readonly historyDbService: DatabaseService<History>,
    private readonly staticsDbService: DatabaseService<Static>,
  ) {
    this.tables = [{
      tableReal: 'Marcas',
      tableName: BrandDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.brandDbService,
    }, {
      tableReal: 'Usuarios',
      tableName: UserDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.userDbService,
    }, {
      tableReal: 'Medidores',
      tableName: MeterDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.meterDbService,
    }, {
      tableReal: 'Templates',
      tableName: EssayTemplateDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.essayTemplateDbService,
    }, {
      tableReal: 'Pasos',
      tableName: EssayTemplateStepDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.essayTemplateStepDbService,
    }, {
      tableReal: 'Historial',
      tableName: HistoryDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.historyDbService,
    }, {
      tableReal: 'Estadísticas',
      tableName: StaticDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.staticsDbService,
    }];
  }

  private tableRows$(table: ExportTable): Observable<any[]> {
    table.databaseService.getTable(table.tableName);
    return table.databaseService.getTableReply$(table.tableName).pipe(map(({ rows }) => rows));
  }

  private getTable$(zip: JSZip, table: ExportTable): Observable<any> {
    return of(table.progress$.next(10)).pipe(
      take(1),
      switchMap(() => this.tableRows$(table)),
      tap(() => table.progress$.next(50)),
      delay(200),
      tap((rows) => {
        const jsonAsString = JSON.stringify(rows);
        zip.file(table.tableName, jsonAsString);
      }),
      delay(200),
      tap(() => table.progress$.next(100)),
      map(() => zip),
    );
  }

  private export$(): Observable<any> {
    return of(this.exporting$.next(true)).pipe(
      take(1),
      delay(200),
      map(() => (new JSZip())),
      switchMap((zip) => this.getTable$(zip, this.tables[0])),
      switchMap((zip) => this.getTable$(zip, this.tables[1])),
      switchMap((zip) => this.getTable$(zip, this.tables[2])),
      switchMap((zip) => this.getTable$(zip, this.tables[3])),
      switchMap((zip) => this.getTable$(zip, this.tables[4])),
      switchMap((zip) => this.getTable$(zip, this.tables[5])),
      switchMap((zip) => this.getTable$(zip, this.tables[6])),
      delay(500),
      switchMap((zip) => zip.generateAsync({ type: "blob" })),
      tap((blob) => {
        const timestamp = (new Date()).getTime();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = `EMETSY_backup_${timestamp}`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }),
      delay(1000),
      tap(() => this.tables.forEach(({ progress$ }) => progress$.next(0))),
      tap(() => this.exporting$.next(false)),
      delay(1000),
      tap(() => this.messagesService.success('Backup creado correctamente', 3000)),
    );
  }

  export(): void {
    this.export$().pipe(take(1)).subscribe();
  }
}
