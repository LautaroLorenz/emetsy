import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, filter, forkJoin, map, Observable, of, ReplaySubject, Subject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, CalculatorParams, ContrastTestExecutionAction, ContrastTestParametersAction, EnterTestValuesAction, PatternParams, Phases, ResponseStatus, ResponseStatusEnum, ResultEnum, StandArrayFormValue, StandIdentificationAction, StandResult } from 'src/app/models';
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

  constructor(
    private readonly executionDirectorService: ExecutionDirector,
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
    private readonly patternService: PatternService,
    private readonly calculatorService: CalculatorService,
    private readonly messagesService: MessagesService,
  ) { }

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
    meterPulses: number,
    numberOfDiscardedResults: number
  ): void {
    let remainingDiscartedResultsCounter = numberOfDiscardedResults;

    this.calculatorService.params$.pipe(
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
            const standPulses: number = Number(result.slice(4, 9));
            const calculatedError = Math.abs(100 - 100 * standPulses / meterPulses);

            return {
              stand: index + 1,
              value: standPulses,
              calculatedError,
              result: calculatedError < maxAllowedError ? ResultEnum.APPROVED : ResultEnum.DISAPPROVED,
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
    const phases: Phases = this.enterTestValuesAction.getPhases();
    const { meterConstant, testName } = this.enterTestValuesAction.form.getRawValue();
    const { maxAllowedError, meterPulses, numberOfDiscardedResults } = this.contrastTestParametersAction.form.getRawValue();
    const preparationStep = this.executionDirectorService.getStepBuilderById(6);
    if (preparationStep) {
      const standIdentificationAction = preparationStep.actions.find((ac) => ac instanceof StandIdentificationAction);
      if (standIdentificationAction) {
        const { hasManufacturingInformation } = standIdentificationAction.form.getRawValue();
        const stands = (standIdentificationAction as StandIdentificationAction).standArray.getRawValue();
        this.lisenResults(stands, maxAllowedError!, meterPulses!, numberOfDiscardedResults!); // TODO:
      }
    }

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
          // TODO: subscribe to listen results
          this.calculatorService.startRerporting();
        }),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      tap(() => this.initialized$.next(true)),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
