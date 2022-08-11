import { Component } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Brand, BrandDbTableContext, EssayTemplate, EssayTemplateDbTableContext, ExportTable, History, HistoryDbTableContext, Meter, MeterDbTableContext, Static, StaticDbTableContext, User, UserDbTableContext } from 'src/app/models';
import { EssayTemplateStep, EssayTemplateStepDbTableContext } from 'src/app/models/database/tables/essay-template-step.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  readonly title: string = 'Exportar';
  readonly tables: ExportTable[];
  readonly exporting$ = new BehaviorSubject<boolean>(false);

  constructor(
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

  private getTable$(table: ExportTable): Observable<any> {
    return of(table.progress$.next(10)).pipe(
      take(1),
      switchMap(() => this.tableRows$(table)),
      delay(200),
      tap(() => table.progress$.next(50)),
      tap((rows) => {
        let theJSON = JSON.stringify(rows);
        let blob = new Blob([theJSON], { type: 'text/json' });
      }),
      tap(() => table.progress$.next(100)),
    );
  }

  private export$(): Observable<any> {
    return of(this.exporting$.next(true)).pipe(
      take(1),
      delay(200),
      // TODO: crear el zip y popularlo
      switchMap(() => this.getTable$(this.tables[0])),
      switchMap(() => this.getTable$(this.tables[1])),
      switchMap(() => this.getTable$(this.tables[2])),
      switchMap(() => this.getTable$(this.tables[3])),
      switchMap(() => this.getTable$(this.tables[4])),
      switchMap(() => this.getTable$(this.tables[5])),
      switchMap(() => this.getTable$(this.tables[6])),
      delay(1000),
      tap(() => this.tables.forEach(({ progress$ }) => progress$.next(0))),
      tap(() => this.exporting$.next(false)),
    );
  }

  export(): void {
    this.export$().pipe(take(1)).subscribe();
  }
}
