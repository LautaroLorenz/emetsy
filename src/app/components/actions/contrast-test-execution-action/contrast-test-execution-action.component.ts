import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, filter, forkJoin, interval, map, Observable, of, ReplaySubject, Subject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, CalculatorParams, ContrastTestExecutionAction, ContrastTestParametersAction, DateHelper, EnterTestValuesAction, Meter, MeterDbTableContext, MetricEnum, PatternParams, Phases, PROTOCOL, RelationsManager, ReportContrastTest, ReportContrastTestBuilder, ResponseStatus, ResponseStatusEnum, ResultEnum, StandArrayFormValue, StandIdentificationAction, StandResult, WhereKind, WhereOperator } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { GeneratorService } from 'src/app/services/generator.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PatternService } from 'src/app/services/pattern.service';
import { StaticsService } from 'src/app/services/statics.service';
import { UsbHandlerService } from 'src/app/services/usb-handler.service';

@Component({
  selector: 'app-contrast-test-execution-action',
  templateUrl: './contrast-test-execution-action.component.html',
  styleUrls: ['./contrast-test-execution-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContrastTestExecutionActionComponent implements ActionComponent, AfterViewInit, OnDestroy {

  @Input() action!: Action;
  readonly phases$: BehaviorSubject<Phases | null> = new BehaviorSubject<Phases | null>(null);
  readonly results$: BehaviorSubject<StandResult[]> = new BehaviorSubject<StandResult[]>([]);
  readonly initialized$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  get executionComplete(): boolean {
    return this.form.get('executionComplete')?.value;
  }
  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }
  get contrastTestParametersAction(): ContrastTestParametersAction {
    return (this.action as ContrastTestExecutionAction).contrastTestParametersAction;
  }
  get enterTestValuesAction(): EnterTestValuesAction {
    return (this.action as ContrastTestExecutionAction).enterTestValuesAction;
  }
  get standIdentificationAction(): StandIdentificationAction {
    return (this.action as ContrastTestExecutionAction).standIdentificationAction;
  }
  get connected(): boolean {
    return this.usbHandlerService.connected$.value;
  }
  get restartDisabled(): boolean {
    return !this.form.get('executionComplete')?.value;
  }

  private executionParams = {
    phases: {} as Phases,
    stands: [] as StandArrayFormValue[],
    maxAllowedError: 0,
    numberOfDiscardedResults: 0
  };
  private activeStands: StandArrayFormValue[] = [];
  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly listenPatternParams$ = new Subject<void>();
  private readonly reportData: ReportContrastTest = {} as ReportContrastTest;
  private readonly executionTime$ = new BehaviorSubject<number>(0);
  private readonly executionControl$ = new Subject<void>();
  private readonly lisenResultsControl$ = new Subject<void>();

  constructor(
    private readonly executionDirectorService: ExecutionDirector,
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
    private readonly patternService: PatternService,
    private readonly calculatorService: CalculatorService,
    private readonly messagesService: MessagesService,
    private readonly dbServiceMeter: DatabaseService<Meter>,
    private readonly staticsService: StaticsService,
  ) {
    this.reportData.reportName = 'ENSAYO DE CONTRASTE';
  }

  private setReportParams(reportData: ReportContrastTest): void {
    const stepBuilder = this.executionDirectorService.getActiveStepBuilder();
    const reportBuilder: ReportContrastTestBuilder = stepBuilder?.reportBuilder as ReportContrastTestBuilder;
    reportBuilder.patchValue(reportData);
  }

  private requestMeters$(meterIds: number[]): Observable<Meter[]> {
    const { foreignTables } = MeterDbTableContext;
    const { tableName } = MeterDbTableContext;
    const foreignTableNames = foreignTables.map(({ tableName }) => tableName);
    const getTableOptions = {
      relations: foreignTableNames,
      conditions: [{
        kind: WhereKind.where,
        columnName: 'id',
        operator: WhereOperator.in,
        value: meterIds
      }]
    };
    this.dbServiceMeter.getTable(tableName, getTableOptions);

    return this.dbServiceMeter.getTableReply$(tableName).pipe(
      takeUntil(this.destroyed$),
      map(({ rows, relations }) => {
        const { foreignTables } = MeterDbTableContext;
        return RelationsManager.mergeRelationsIntoRows<Meter>(rows, relations, foreignTables);
      }),
    );
  }

  private timeStart(): void {
    this.timeStop();
    interval(1000).pipe(
      takeUntil(this.executionControl$),
      tap(() => this.executionTime$.next(this.executionTime$.value + 1)),
    ).subscribe();
  }

  private timeStop(): void {
    this.executionControl$.next();
    this.executionTime$.next(0);
  }

  private completeAction$(): Observable<Record<string, ResponseStatus>> {
    return forkJoin<Record<string, Observable<ResponseStatus>>>({
      turnOffGenerator: this.generatorService.turnOff$(),
      turnOffPattern: this.patternService.turnOff$(),
      turnOffCalculator: this.calculatorService.turnOff$(),
    }).pipe(
      take(1),
      filter((response) => {
        const hasError = Object.keys(response).some(key => response[key] !== ResponseStatusEnum.ACK);
        return !hasError;
      }),
      tap(() => this.reportData.executionSeconds = this.executionTime$.value),
      tap(() => this.setReportParams(this.reportData)),
      tap(() => this.form.get('executionComplete')?.setValue(true)),
      switchMap((value) => this.usbHandlerService.disconnect$().pipe(
        map(() => value)
      )),
    );
  }

  private listenPatternParams(): void {
    this.listenPatternParams$.next();
    this.patternService.params$.pipe(
      takeUntil(this.listenPatternParams$),
      filter((params) => params !== null),
      map((params) => params as PatternParams),
      tap(({ phases }) => this.phases$.next(phases))
    ).subscribe();
  }

  private lisenResults(executionParams: typeof this.executionParams): void {
    const { numberOfDiscardedResults, maxAllowedError, stands } = executionParams;
    this.lisenResultsControl$.next();
    this.results$.next([]);
    let remainingDiscartedResultsCounter = numberOfDiscardedResults;

    this.calculatorService.params$.pipe(
      takeUntil(this.lisenResultsControl$),
      takeUntil(this.destroyed$),
      takeWhile(() => !this.executionComplete),
      filter((value) => value !== null),
      map((value) => value as CalculatorParams),
      tap(() => {
        if (remainingDiscartedResultsCounter > 0) {
          remainingDiscartedResultsCounter--;
        }
      }),
      filter(() => remainingDiscartedResultsCounter === 0),
      map(({ results }) => {
        const standResults: StandResult[] = results
          .map((result, index) => {
            const calculatorErrorValue: number = Number(result.slice(3, 9)) / 100;
            const calculatorErrorValueAbs: number = Math.abs(calculatorErrorValue);
            const resultReal = calculatorErrorValueAbs < maxAllowedError ? ResultEnum.APPROVED : ResultEnum.DISAPPROVED;

            const resultStandIndex: number = index + 1;
            const reportStand = this.reportData.stands.find(({ standIndex }) => standIndex === resultStandIndex);
            if (reportStand) {
              reportStand.value = calculatorErrorValue;
              reportStand.result = resultReal;

              if (resultReal === ResultEnum.APPROVED) {
                this.staticsService.increment$(MetricEnum.meterApproves, { meter: reportStand?.brandModel ?? '' }).pipe(take(1)).subscribe();
              }
            } else {
              console.warn(`El stand ${resultStandIndex} no se pudo agregar al reporte`);
            }

            return {
              stand: resultStandIndex,
              calculatorValue: calculatorErrorValue,
              result: resultReal,
            };
          }).filter((standResult) => stands[standResult.stand - 1]?.isActive);

        return standResults;
      }),
      tap((standResults) => this.results$.next(standResults)),
      switchMap(() => this.completeAction$()),
      catchError((error) => {
        console.error(error);
        this.messagesService.error('Ocurrió un error durante el calculo de resultados.');
        return of(void 0)
      }),
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.timeStart();

    this.reportData.executionDateString = DateHelper.getNow();
    const phases: Phases = this.enterTestValuesAction.getPhases();
    const { maxAllowedError, numberOfDiscardedResults } = this.contrastTestParametersAction.form.getRawValue();
    this.reportData.maxAllowedError = maxAllowedError ?? 0;

    const stands = this.standIdentificationAction.standArray.getRawValue();
    this.activeStands = stands.filter(({ isActive }) => isActive);
    this.reportData.standsLength = this.activeStands.length;
    this.reportData.stands = [];
    const meterIds = this.activeStands.map(({ meterId }) => meterId as number);
    this.requestMeters$(meterIds).pipe(
      take(1),
      tap((meters) => {
        this.reportData.stands = this.activeStands.map((stand) => {
          const meter = meters.find(({ id }) => stand.meterId == id);
          this.staticsService.increment$(MetricEnum.standUsed, { standIndex: (stand.standIndex as number).toString() }).pipe(take(1)).subscribe();
          return {
            standIndex: stand.standIndex as number,
            brandModel: `${meter?.foreign.brand.name} - ${meter?.model}`,
            value: null,
            result: null,
            serialNumber: stand.serialNumber as string,
            yearOfProduction: stand.yearOfProduction as number
          }
        });
      }),
    ).subscribe();

    this.executionParams = {
      phases,
      stands,
      maxAllowedError: maxAllowedError as number,
      numberOfDiscardedResults: numberOfDiscardedResults as number,
    };

    this.usbHandlerService.connected$.pipe(
      takeUntil(this.destroyed$),
      filter((isConnected) => isConnected),
      tap(() => {
        this.results$.next([]);
        this.initialized$.next(false);
        this.generatorService.clearStatus();
        this.patternService.clearStatus();
        this.calculatorService.clearStatus();
        this.lisenResultsControl$.next();
      }),
      switchMap(() => this.generatorService.turnOn$(this.executionParams.phases).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        switchMap(() => this.generatorService.getStatus$()),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      switchMap(() => this.patternService.turnOn$(this.executionParams.phases).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        tap(() => {
          this.listenPatternParams();
          this.patternService.startRerporting();
        }),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      switchMap(() => this.calculatorService.turnOn$(PROTOCOL.DEVICE.CALCULATOR.COMMAND.ESSAY.CONTRAST).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        tap(() => {
          this.calculatorService.startRerporting();
        }),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      tap(() => this.lisenResults(this.executionParams)),
      tap(() => this.initialized$.next(true)),
    ).subscribe();
  }

  restart(): void {
    this.form.get('executionComplete')?.setValue(undefined);
    this.usbHandlerService.connect$().pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.timeStop();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
