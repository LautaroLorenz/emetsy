import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, filter, forkJoin, interval, map, Observable, of, ReplaySubject, Subject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, CalculatorParams, DateHelper, EnterTestValuesAction, Meter, MeterDbTableContext, MetricEnum, PatternParams, Phases, PROTOCOL, RelationsManager, ReportVacuumTest, ReportVacuumTestBuilder, ResponseStatus, ResponseStatusEnum, ResultEnum, StandArrayFormValue, StandIdentificationAction, StandResult, VacuumTestExecutionAction, VacuumTestParametersAction, WhereKind, WhereOperator } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { GeneratorService } from 'src/app/services/generator.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PatternService } from 'src/app/services/pattern.service';
import { StaticsService } from 'src/app/services/statics.service';
import { UsbHandlerService } from 'src/app/services/usb-handler.service';

@Component({
  selector: 'app-vacuum-test-execution-action',
  templateUrl: './vacuum-test-execution-action.component.html',
  styleUrls: ['./vacuum-test-execution-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VacuumTestExecutionActionComponent implements ActionComponent, AfterViewInit, OnDestroy {

  @Input() action!: Action;
  readonly phases$: BehaviorSubject<Phases | null> = new BehaviorSubject<Phases | null>(null);
  readonly results$: BehaviorSubject<StandResult[]> = new BehaviorSubject<StandResult[]>([]);
  readonly initialized$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  readonly canConnect$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly essayTimer = {
    progressPercentage$: new BehaviorSubject<number>(0),
    progressSeconds: 0,
    durationSeconds: 0,
  };
  get executionComplete(): boolean {
    return this.form.get('executionComplete')?.value;
  }
  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }
  get vacuumTestParametersAction(): VacuumTestParametersAction {
    return (this.action as VacuumTestExecutionAction).vacuumTestParametersAction;
  }
  get enterTestValuesAction(): EnterTestValuesAction {
    return (this.action as VacuumTestExecutionAction).enterTestValuesAction;
  }
  get standIdentificationAction(): StandIdentificationAction {
    return (this.action as VacuumTestExecutionAction).standIdentificationAction;
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
    maxAllowedPulses: 0,
    durationSeconds: 0
  };
  private activeStands: StandArrayFormValue[] = [];
  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private readonly listenPatternParams$ = new Subject<void>();
  private readonly reportData: ReportVacuumTest = {} as ReportVacuumTest;
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
    this.reportData.reportName = 'ENSAYO DE VACÍO';
  }

  private setReportParams(reportData: ReportVacuumTest): void {
    const stepBuilder = this.executionDirectorService.getActiveStepBuilder();
    const reportBuilder: ReportVacuumTestBuilder = stepBuilder?.reportBuilder as ReportVacuumTestBuilder;
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
        tap(() => this.canConnect$.next(false)),
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

  private setResultStatic(standResults: StandResult[]): void {
    standResults.forEach(({ result, stand, calculatorValue }) => {
      const reportStand = this.reportData.stands.find(({ standIndex }) => standIndex === stand);
      if (reportStand) {
        reportStand.value = calculatorValue;
        reportStand.result = result;

        if (result === ResultEnum.APPROVED) {
          this.staticsService.increment$(MetricEnum.meterApproves, { meter: reportStand?.brandModel ?? '' }).pipe(take(1)).subscribe();
        }
      } else {
        console.warn(`El stand ${stand} no se pudo agregar al reporte`);
      };
    });
  }

  private lisenResults(executionParams: typeof this.executionParams): void {
    const { durationSeconds, maxAllowedPulses, stands } = executionParams;
    this.lisenResultsControl$.next();
    this.results$.next([]);
    this.essayTimer.progressPercentage$.next(0);
    this.essayTimer.progressSeconds = 0;
    this.essayTimer.durationSeconds = durationSeconds;
    const timerControl$ = new Subject<void>();

    interval(1000).pipe(
      takeUntil(timerControl$),
      tap(() => {
        this.essayTimer.progressSeconds = this.essayTimer.progressSeconds + 1;
        const progressPercetange = Math.floor(100 * this.essayTimer.progressSeconds / this.essayTimer.durationSeconds);
        this.essayTimer.progressPercentage$.next(progressPercetange);
        if (progressPercetange >= 100) {
          timerControl$.next();
          this.lisenResultsControl$.next();
          this.completeAction$().subscribe();
          this.setResultStatic(this.results$.value);
        }
      }),
    ).subscribe();

    this.calculatorService.params$.pipe(
      takeUntil(this.lisenResultsControl$),
      takeUntil(this.destroyed$),
      takeWhile(() => !this.executionComplete),
      filter((value) => value !== null),
      map((value) => value as CalculatorParams),
      map(({ results }) => {
        const standResults: StandResult[] = results
          .map((result, index) => {
            const calculatorPulsesValue: number = Number(result.slice(3, 9));
            const resultReal = calculatorPulsesValue <= maxAllowedPulses ? ResultEnum.APPROVED : ResultEnum.DISAPPROVED;
            const resultStandIndex: number = index + 1;
            return {
              stand: resultStandIndex,
              calculatorValue: calculatorPulsesValue,
              result: resultReal,
            };
          }).filter((standResult) => stands[standResult.stand - 1]?.isActive);

        return standResults;
      }),
      tap((standResults) => this.results$.next(standResults)),
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
    const { maxAllowedPulses, durationSeconds } = this.vacuumTestParametersAction.form.getRawValue();
    const stands = this.standIdentificationAction.standArray.getRawValue();

    this.reportData.maxAllowedPulses = maxAllowedPulses as number;
    this.reportData.durationSeconds = durationSeconds as number;
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
      maxAllowedPulses: maxAllowedPulses as number,
      durationSeconds: durationSeconds as number,
    };

    this.usbHandlerService.connected$.pipe(
      takeUntil(this.destroyed$),
      filter((isConnected) => isConnected),
      tap(() => this.canConnect$.next(true)),
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
      switchMap(() => this.calculatorService.turnOn$(PROTOCOL.DEVICE.CALCULATOR.COMMAND.ESSAY.VACUUM).pipe(
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