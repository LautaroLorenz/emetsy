import { Component } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, take, tap } from 'rxjs';
import { BrandDbTableContext, EssayTemplateDbTableContext, HistoryDbTableContext, MeterDbTableContext, TableName, UserDbTableContext } from 'src/app/models';
import { EssayTemplateStepDbTableContext } from 'src/app/models/database/tables/essay-template-step.model';

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  readonly title: string = 'Exportar';
  readonly tables: ({ tableName: TableName, tableReal: string, progress$: BehaviorSubject<number> })[];
  readonly exporting$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.tables = [{
      tableReal: 'Marcas',
      tableName: BrandDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
    }, {
      tableReal: 'Usuarios',
      tableName: UserDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
    }, {
      tableReal: 'Medidores',
      tableName: MeterDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
    }, {
      tableReal: 'Templates',
      tableName: EssayTemplateDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
    }, {
      tableReal: 'Pasos',
      tableName: EssayTemplateStepDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
    }, {
      tableReal: 'Historial',
      tableName: HistoryDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
    }, {
      tableReal: 'Estadísticas',
      tableName: HistoryDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
    }];
  }

  private export$(): Observable<any> {
    return of(this.exporting$.next(true)).pipe(
      take(1),
      delay(750),
      tap(() => this.exporting$.next(false)),
    );
  }

  export(): void {
    this.export$().pipe(take(1)).subscribe();
  }
}
