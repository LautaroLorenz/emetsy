import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, ReplaySubject, switchMap, takeUntil, filter, map, tap, take, Observable, of, delay, catchError } from 'rxjs';
import * as JSZip from 'jszip';
import { Brand, EssayTemplate, Meter, User, EssayTemplateStep, Static, BrandDbTableContext, UserDbTableContext, MeterDbTableContext, EssayTemplateDbTableContext, EssayTemplateStepDbTableContext, HistoryDbTableContext, StaticDbTableContext, ImportTable, ImportResult } from 'src/app/models';
import { DatabaseService } from 'src/app/services/database.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit, OnDestroy {

  readonly title: string = 'Importar';
  readonly tables: ImportTable[];
  readonly importing$ = new BehaviorSubject<boolean>(false);
  readonly tablesLoaded$ = new BehaviorSubject<boolean>(false);
  readonly items: MenuItem[];
  readonly activeIndex$ = new BehaviorSubject<number>(0);
  readonly zipFiles$ = new BehaviorSubject<Record<string, JSZip.JSZipObject> | null>(null);
  readonly showIgnoredAlert$ = new BehaviorSubject<boolean>(false);
  readonly showHelp$ = new BehaviorSubject<boolean>(false);
  private readonly file$ = new BehaviorSubject<File | null>(null);
  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

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
    this.items = [
      {
        label: 'Seleccionar backup',
        command: () => this.activeIndex$.next(0),
      },
      { label: 'Importar tablas' },
      { label: 'Ver resultado' }
    ];
    this.tables = [{
      tableReal: 'Marcas',
      tableName: BrandDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.brandDbService,
      result$: new BehaviorSubject<ImportResult>({ imported: 0, ignored: 0 }),
    }, {
      tableReal: 'Usuarios',
      tableName: UserDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.userDbService,
      result$: new BehaviorSubject<ImportResult>({ imported: 0, ignored: 0 }),
    }, {
      tableReal: 'Medidores',
      tableName: MeterDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.meterDbService,
      result$: new BehaviorSubject<ImportResult>({ imported: 0, ignored: 0 }),
    }, {
      tableReal: 'Templates',
      tableName: EssayTemplateDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.essayTemplateDbService,
      result$: new BehaviorSubject<ImportResult>({ imported: 0, ignored: 0 }),
    }, {
      tableReal: 'Pasos',
      tableName: EssayTemplateStepDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.essayTemplateStepDbService,
      result$: new BehaviorSubject<ImportResult>({ imported: 0, ignored: 0 }),
    }, {
      tableReal: 'Historial',
      tableName: HistoryDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.historyDbService,
      result$: new BehaviorSubject<ImportResult>({ imported: 0, ignored: 0 }),
    }, {
      tableReal: 'Estadísticas',
      tableName: StaticDbTableContext.tableName,
      progress$: new BehaviorSubject<number>(0),
      databaseService: this.staticsDbService,
      result$: new BehaviorSubject<ImportResult>({ imported: 0, ignored: 0 }),
    }];
  }

  private file$Subscribe(): void {
    this.file$.pipe(
      takeUntil(this.destroyed$),
      filter((file) => file !== null),
      map((file) => file as File),
      switchMap((file) => JSZip.loadAsync(file)),
      tap(({ files }) => this.zipFiles$.next(files)),
      tap(({ files }) => {
        const uploadedFileNames = Object.keys(files);
        const acceptedFileNames = this.tables.map(({ tableName }) => tableName);
        if (uploadedFileNames.some((fileName) => acceptedFileNames.includes(fileName)) === false) {
          this.messagesService.error('Backup no aceptado, seleccione un archivo exportado por el sistema.');
          this.showHelp$.next(true);
          return;
        }
        this.activeIndex$.next(1);
      }),
    ).subscribe();
  }

  private insertTableRows$(table: ImportTable, rows: any[], result: ImportResult, index: number): Observable<ImportResult> {
    if (index === rows.length) {
      return of(result);
    }
    return table.databaseService.addElementToTable$(table.tableName, rows[index]).pipe(
      take(1),
      switchMap(() => {
        result.imported++;
        return this.insertTableRows$(table, rows, result, index + 1);
      }),
      catchError(() => {
        result.ignored++;
        return this.insertTableRows$(table, rows, result, index + 1);
      }),
    );
  }

  private saveTable$(table: ImportTable): Observable<any> {
    if (!this.zipFiles$.value || !this.zipFiles$.value[table.tableName]) {
      return of(false);
    }
    const zipFile = this.zipFiles$.value[table.tableName];
    return of(table.progress$.next(1)).pipe(
      take(1),
      switchMap(() => zipFile.async('string')),
      tap(() => table.progress$.next(30)),
      map((result) => JSON.parse(result)),
      switchMap((rows) => this.insertTableRows$(table, rows, { imported: 0, ignored: 0 }, 0)),
      tap(({ ignored }) => {
        if (ignored > 0) {
          this.showIgnoredAlert$.next(true);
        }
      }),
      tap((importedResult) => table.result$.next(importedResult)),
      tap(() => table.progress$.next(100)),
    );
  }

  private import$(): Observable<any> {
    return of(this.importing$.next(true)).pipe(
      take(1),
      delay(200),
      switchMap(() => this.saveTable$(this.tables[0])),
      switchMap(() => this.saveTable$(this.tables[1])),
      switchMap(() => this.saveTable$(this.tables[2])),
      switchMap(() => this.saveTable$(this.tables[3])),
      switchMap(() => this.saveTable$(this.tables[4])),
      switchMap(() => this.saveTable$(this.tables[5])),
      switchMap(() => this.saveTable$(this.tables[6])),
      delay(1000),
      tap(() => this.activeIndex$.next(2)),
      tap(() => this.importing$.next(false)),
      tap(() => this.messagesService.success('Backup importado correctamente', 3000)),
    );
  }

  ngOnInit(): void {
    this.file$Subscribe();
  }

  uploadHandler(event: { files: File[] }): void {
    const [file] = event.files;
    this.importing$.next(false);
    this.showIgnoredAlert$.next(false);
    this.showHelp$.next(false);
    this.tables.forEach(({ result$, progress$ }) => {
      progress$.next(0);
      result$.next({ imported: 0, ignored: 0 });
    });
    this.file$.next(file);
  }

  import(): void {
    this.import$().pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
