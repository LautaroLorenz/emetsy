import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, filter, forkJoin, interval, map, Observable, of, ReplaySubject, Subject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, CalculatorParams, ContrastTestExecutionAction, ContrastTestParametersAction, DateHelper, EnterTestValuesAction, ManofacturingInformation, Meter, MeterDbTableContext, PatternParams, Phases, RelationsManager, ReportContrastTest, ReportContrastTestBuilder, ResponseStatus, ResponseStatusEnum, ResultEnum, StandArrayFormValue, StandIdentificationAction, StandResult, StepIdEnum, UserIdentificationAction, WhereKind, WhereOperator } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { GeneratorService } from 'src/app/services/generator.service';
import { MessagesService } from 'src/app/services/messages.service';
import { PatternService } from 'src/app/services/pattern.service';
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
  readonly canConnect$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get contrastTestExecutionComplete(): boolean {
    return this.form.get('contrastTestExecutionComplete')?.value;
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
  get connected(): boolean {
    return this.usbHandlerService.connected$.value;
  }
  get restartDisabled(): boolean {
    return !this.form.get('contrastTestExecutionComplete')?.value;
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
  ) {
    this.reportData.reportName = 'ENSAYO DE CONTRASTE';
  }

  private setReportParams(reportData: ReportContrastTest): void {
    const stepBuilder = this.executionDirectorService.getActiveStepBuilder();
    const reportBuilder: ReportContrastTestBuilder = stepBuilder?.reportBuilder as ReportContrastTestBuilder;
    reportBuilder.pathValue(reportData);
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
      tap(() => this.form.get('contrastTestExecutionComplete')?.setValue(true)),
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

  private lisenResults(
    stands: StandArrayFormValue[],
    maxAllowedError: number,
    numberOfDiscardedResults: number
  ): void {
    this.lisenResultsControl$.next();
    this.results$.next([]);
    let remainingDiscartedResultsCounter = numberOfDiscardedResults;

    this.calculatorService.params$.pipe(
      takeUntil(this.lisenResultsControl$),
      takeUntil(this.destroyed$),
      takeWhile(() => !this.contrastTestExecutionComplete),
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
              reportStand.errorValue = calculatorErrorValue;
              reportStand.result = resultReal;
            } else {
              console.warn(`El stand ${resultStandIndex} no se pudo agregar al reporte`);
            }
            return {
              stand: resultStandIndex,
              calculatorErrorValue,
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
    const { meterConstant } = this.enterTestValuesAction.form.getRawValue();
    const { maxAllowedError, meterPulses, numberOfDiscardedResults } = this.contrastTestParametersAction.form.getRawValue();
    if (maxAllowedError === null || maxAllowedError === undefined) {
      throw new Error('No se configuró el error permitido');
    }
    if (numberOfDiscardedResults === null || numberOfDiscardedResults === undefined) {
      throw new Error('No se configuró el número de resultados para descartar');
    }
    this.reportData.maxAllowedError = maxAllowedError ?? 0;
    const preparationStep = this.executionDirectorService.getStepBuilderById(StepIdEnum.PreparationStep);
    if (!preparationStep) {
      throw new Error('Paso de preparación no encontrado');
    }
    const userIdentificationAction: UserIdentificationAction = preparationStep.actions.find((ac) => ac instanceof UserIdentificationAction) as UserIdentificationAction;
    if (userIdentificationAction) {
      const { selectedUser } = userIdentificationAction;
      if (selectedUser) {
        const { surname, name, identification } = selectedUser;
        this.reportData.userName = `${surname}, ${name} - ${identification}`;
      }
    }
    const standIdentificationAction = preparationStep.actions.find((ac) => ac instanceof StandIdentificationAction);
    if (!standIdentificationAction) {
      throw new Error('Paso de identificación no encontrado');
    }
    const { hasManufacturingInformation } = standIdentificationAction.form.getRawValue();
    const stands = (standIdentificationAction as StandIdentificationAction).standArray.getRawValue();
    this.activeStands = stands.filter(({ isActive }) => isActive);

    this.reportData.standsLength = this.activeStands.length;
    this.reportData.stands = [];
    const meterIds = this.activeStands.map(({ meterId }) => meterId as number);
    this.requestMeters$(meterIds).pipe(
      take(1),
      tap((meters) => {
        this.reportData.stands = this.activeStands.map((stand) => {
          const meter = meters.find(({ id }) => stand.meterId == id);
          let manofacturingInformation: ManofacturingInformation | undefined = undefined;
          if (hasManufacturingInformation) {
            manofacturingInformation = {
              serialNumber: stand.serialNumber as string,
              yearOfProduction: stand.yearOfProduction as number
            };
          }
          return {
            standIndex: stand.standIndex as number,
            brandModel: `${meter?.foreign.brand.name} - ${meter?.model}`,
            errorValue: null,
            result: null,
            manofacturingInformation,
          }
        });
      }),
    ).subscribe();

    this.executionParams = {
      phases,
      maxAllowedError,
      numberOfDiscardedResults,
      stands,
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
      switchMap(() => this.calculatorService.turnOn$(/* TODO: params */).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        tap(() => {
          this.calculatorService.startRerporting();
        }),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      tap(() => this.lisenResults(
        this.executionParams.stands,
        this.executionParams.maxAllowedError,
        this.executionParams.numberOfDiscardedResults
      )),
      tap(() => this.initialized$.next(true)),
    ).subscribe();
  }

  restart(): void {
    this.form.get('contrastTestExecutionComplete')?.setValue(undefined);
    this.usbHandlerService.connect$().pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.timeStop();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
