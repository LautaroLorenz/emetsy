import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, skip, take, takeUntil, tap } from 'rxjs';
import { DeviceStatus, DeviceStatusEnum, LedColor, LedColorEnum } from 'src/app/models';
import { CalculatorService } from 'src/app/services/calculator.service';
import { GeneratorService } from 'src/app/services/generator.service';
import { PatternService } from 'src/app/services/pattern.service';
import { UsbHandlerService } from 'src/app/services/usb-handler.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DevicesComponent implements OnInit, OnDestroy {

  @Input() canConnect: boolean = true;

  connected$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  connectedColor$: BehaviorSubject<LedColor> = new BehaviorSubject<LedColor>(LedColorEnum.WHITE);
  transmittingColor$: BehaviorSubject<LedColor> = new BehaviorSubject<LedColor>(LedColorEnum.WHITE);
  generatorStatusColor$: BehaviorSubject<LedColor> = new BehaviorSubject<LedColor>(LedColorEnum.WHITE);
  patternStatusColor$: BehaviorSubject<LedColor> = new BehaviorSubject<LedColor>(LedColorEnum.WHITE);
  calculatorStatusColor$: BehaviorSubject<LedColor> = new BehaviorSubject<LedColor>(LedColorEnum.WHITE);

  get generatorErrorMessage$(): Observable<string | null> {
    return this.generatorService.errorMessage$;
  }
  get patternErrorMessage$(): Observable<string | null> {
    return this.patternService.errorMessage$;
  }
  get calculatorErrorMessage$(): Observable<string | null> {
    return this.calculatorService.errorMessage$;
  }

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
    private readonly patternService: PatternService,
    private readonly calculatorService: CalculatorService,
  ) { }

  private colorByStatus(status: DeviceStatus): LedColor {
    switch (status) {
      case DeviceStatusEnum.UNKNOWN:
        return LedColorEnum.WHITE;
      case DeviceStatusEnum.TURN_ON:
        return LedColorEnum.GREEN;
      case DeviceStatusEnum.TURN_OFF:
        return LedColorEnum.GREY;
      case DeviceStatusEnum.FAIL:
        return LedColorEnum.RED;
    }
  }

  private disconnect(): void {
    this.usbHandlerService.disconnect$().pipe(
      take(1),
    ).subscribe();
  }

  ngOnInit() {
    this.usbHandlerService.connected$.pipe(
      skip(1),
      takeUntil(this.destroyed$),
      tap((isConnected) => this.connected$.next(isConnected)),
      tap((isConnected) => this.connectedColor$.next(isConnected ? LedColorEnum.GREEN : LedColorEnum.GREY))
    ).subscribe();

    this.usbHandlerService.sendAndWaitInProgress$.pipe(
      takeUntil(this.destroyed$),
      tap((isTransmitting) => this.transmittingColor$.next(isTransmitting ? LedColorEnum.GREEN : LedColorEnum.GREY)),
    ).subscribe();

    this.generatorService.deviceStatus$.pipe(
      takeUntil(this.destroyed$),
      tap((status) => this.generatorStatusColor$.next(this.colorByStatus(status))),
    ).subscribe();

    this.patternService.deviceStatus$.pipe(
      takeUntil(this.destroyed$),
      tap((status) => this.patternStatusColor$.next(this.colorByStatus(status))),
    ).subscribe();

    this.calculatorService.deviceStatus$.pipe(
      takeUntil(this.destroyed$),
      tap((status) => this.calculatorStatusColor$.next(this.colorByStatus(status))),
    ).subscribe();

    this.connect();
  }

  connect(): void {
    this.usbHandlerService.connect$().pipe(
      take(1),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
