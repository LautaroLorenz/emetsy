import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, filter, forkJoin, interval, map, Observable, of, ReplaySubject, Subject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, CalculatorParams, ContrastTestExecutionAction, ContrastTestParametersAction, EnterTestValuesAction, PatternParams, Phases, ReportContrastTest, ReportContrastTestBuilder, ResponseStatus, ResponseStatusEnum, ResultEnum, StandArrayFormValue, StandIdentificationAction, StandResult, UserIdentificationAction } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';
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
  ) {
    this.reportData.reportName = 'ENSAYO DE CONTRASTE';
  }

  private getExecutionDateString(): string {
    const now = new Date();
    const day = now.getDay();
    const dd = day < 10 ? '0' + day : day;
    const month = now.getMonth() + 1;
    const mm = month < 10 ? '0' + month : month;
    const hour = now.getHours();
    const hh = (hour < 10) ? '0' + hour : hour;
    const minute = now.getMinutes();
    const min = (minute < 10) ? '0' + minute : minute;
    return dd + "/" + mm + "/" + now.getFullYear() + " " + (hh || '00') + ':' + (min || '00');
  }

  private setReportParams(reportData: ReportContrastTest): void {
    const stepBuilder = this.executionDirectorService.getActiveStepBuilder();
    const reportBuilder: ReportContrastTestBuilder = stepBuilder?.reportBuilder as ReportContrastTestBuilder;
    reportBuilder.pathValue(reportData);
    // TODO:
    // reportBuilder.pathValue({ 
    // stands: [{
    //   standIndex: 1,
    //   brandModel: 'BETEL - XTR123',
    //   errorValue: 5,
    //   result: ResultEnum.APPROVED,
    // }, {
    //   standIndex: 2,
    //   brandModel: 'BETEL - TRESS543',
    //   errorValue: 3,
    //   result: ResultEnum.DISAPPROVED,
    //   manofacturingInformation: {
    //     serialNumber: 'SSJJ54439-231234',
    //     yearOfProduction: 2010
    //   }
    // }],
    // });
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

            return {
              stand: index + 1,
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

    this.reportData.executionDateString = this.getExecutionDateString();
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
    const preparationStep = this.executionDirectorService.getStepBuilderById(7);
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

    this.reportData.standsLength = stands.filter(({ isActive }) => isActive).length;
    console.log(stands);
    // this.reportData.stands = stands.filter(({ isActive }) => isActive).map((s) => ({
    //   brandModel,
    //   result,
    //   errorValue,
    //   standIndex,
    //   manofacturingInformation
    // }));

    this.usbHandlerService.connected$.pipe(
      takeUntil(this.destroyed$),
      takeWhile(() => !this.contrastTestExecutionComplete),
      tap(() => {
        this.initialized$.next(false);
        this.generatorService.clearStatus();
        this.patternService.clearStatus();
        this.calculatorService.clearStatus();
      }),
      filter((isConnected) => isConnected),
      switchMap(() => this.generatorService.turnOn$(phases).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        switchMap(() => this.generatorService.getStatus$()),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      switchMap(() => this.patternService.turnOn$(phases).pipe(
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
      tap(() => this.lisenResults(stands, maxAllowedError, numberOfDiscardedResults)),
      tap(() => this.initialized$.next(true)),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.timeStop();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
