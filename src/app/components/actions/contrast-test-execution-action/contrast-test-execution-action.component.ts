import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, filter, forkJoin, Observable, ReplaySubject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, ContrastTestExecutionAction, ContrastTestParametersAction, EnterTestValuesAction, Phases, ResponseStatus, ResponseStatusEnum, StandIdentificationAction } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';
import { ExecutionDirector } from 'src/app/services/execution-director.service';
import { GeneratorService } from 'src/app/services/generator.service';
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

  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly executionDirectorService: ExecutionDirector,
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
    private readonly patternService: PatternService,
    private readonly calculatorService: CalculatorService,
  ) { }

  ngAfterViewInit(): void {
    const phases: Phases = this.enterTestValuesAction.getPhases();
    const { meterConstant, testName } = this.enterTestValuesAction.form.getRawValue();
    const { maxAllowedError, meterPulses, numberOfDiscardedResults } = this.contrastTestParametersAction.form.getRawValue();
    const preparationStep = this.executionDirectorService.getStepBuilderById(6);
    if (preparationStep) {
      const standIdentificationAction = preparationStep.actions.find((ac) => ac instanceof StandIdentificationAction)
      if (standIdentificationAction) {
        const { hasManufacturingInformation, stands } = standIdentificationAction.form.getRawValue();
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
      switchMap(() => this.generatorService.setWorkingParams$(phases).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        switchMap(() => this.generatorService.getStatus$()),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      switchMap(() => this.patternService.setWorkingParams$(phases).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        tap(() => this.patternService.startRerporting()),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      switchMap(() => this.calculatorService.setWorkingParams$(
        // phases // TODO:
      ).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        tap(() => this.calculatorService.startRerporting()),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      tap(() => this.initialized$.next(true)),
    ).subscribe();
  }

  completeAction(): void {
    forkJoin<Record<string, Observable<ResponseStatus>>>({
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
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
