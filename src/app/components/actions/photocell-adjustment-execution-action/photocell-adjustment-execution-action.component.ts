import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, filter, forkJoin, Observable, ReplaySubject, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs';
import { Action, ActionComponent, Phases, PhotocellAdjustmentExecutionAction, PhotocellAdjustmentValuesAction, ResponseStatus, ResponseStatusEnum } from 'src/app/models';
import { GeneratorService } from 'src/app/services/generator.service';
import { PatternService } from 'src/app/services/pattern.service';
import { UsbHandlerService } from 'src/app/services/usb-handler.service';

@Component({
  selector: 'app-photocell-adjustment-execution-action',
  templateUrl: './photocell-adjustment-execution-action.component.html',
  styleUrls: ['./photocell-adjustment-execution-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhotocellAdjustmentExecutionActionComponent implements ActionComponent, AfterViewInit, OnDestroy {

  @Input() action!: Action;

  readonly initialized$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

  get helpText(): string {
    return !this.photocellAdjustmentExecutionComplete
      ? 'Realice el ajuste de fotocélulas y luego indique en el software que el ajuste fue realizado.'
      : 'Ajuste de fotocélulas realizado, ya puede confirmar.'
  }
  get photocellAdjustmentExecutionComplete(): boolean {
    return this.form.get('photocellAdjustmentExecutionComplete')?.value;
  }
  get name(): string {
    return this.action.name;
  }
  get form(): FormGroup {
    return this.action.form;
  }
  get photocellAdjustmentValuesAction(): PhotocellAdjustmentValuesAction {
    return (this.action as PhotocellAdjustmentExecutionAction).photocellAdjustmentValuesAction;
  }
  get connected(): boolean {
    return this.usbHandlerService.connected$.value;
  }

  protected readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
    private readonly patternService: PatternService,
  ) { }

  ngAfterViewInit(): void {
    const phases: Phases = this.photocellAdjustmentValuesAction.getPhases();

    this.usbHandlerService.connected$.pipe(
      takeUntil(this.destroyed$),
      takeWhile(() => !this.photocellAdjustmentExecutionComplete),
      tap(() => {
        this.initialized$.next(false);
        this.generatorService.clearStatus();
        this.patternService.clearStatus();
      }),
      filter((isConnected) => isConnected),
      switchMap(() => this.generatorService.turnOn$(phases).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        switchMap(() => this.generatorService.getStatus$()),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      switchMap(() => this.patternService.turnOn$(phases).pipe(
        filter(status => status === ResponseStatusEnum.ACK),
        tap(() => this.patternService.startRerporting()),
      )),
      filter(status => status === ResponseStatusEnum.ACK),
      tap(() => this.initialized$.next(true)),
    ).subscribe();
  }

  completeAction(): void {
    forkJoin<Record<string, Observable<ResponseStatus>>>({
      turnOffGenerator: this.generatorService.turnOff$(),
      turnOffPattern: this.patternService.turnOff$(),
    }).pipe(
      take(1),
      filter((response) => {
        const hasError = Object.keys(response).some(key => response[key] !== ResponseStatusEnum.ACK);
        return !hasError;
      }),
      tap(() => this.form.get('photocellAdjustmentExecutionComplete')?.setValue(true)),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
