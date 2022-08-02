import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { UsbHandlerService } from '../services/usb-handler.service';
import { GeneratorService } from '../services/generator.service';
import { PatternService } from '../services/pattern.service';
import { DeviceStatusEnum, ResponseStatusEnum } from '../models';
import { CalculatorService } from '../services/calculator.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean>;
}

@Injectable()
export class DevicesTurnOffGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
    private readonly patternService: PatternService,
    private readonly calculatorService: CalculatorService,
  ) { }

  canDeactivate(): Observable<boolean> {
    return of(this.usbHandlerService.connected$.value).pipe(
      switchMap((isConnected) => {
        if (!isConnected) {
          return of(true);
        }
        return of(false).pipe(
          switchMap(() => forkJoin({
            generatorStatus: of(this.generatorService.deviceStatus$.value),
            patternStatus: of(this.patternService.deviceStatus$.value),
            calculatorStatus: of(this.calculatorService.deviceStatus$.value),
          }).pipe(
            switchMap(({ generatorStatus, patternStatus, calculatorStatus }) => {
              return of({ generatorStatus, patternStatus, calculatorStatus }).pipe(
                switchMap(({ generatorStatus, patternStatus, calculatorStatus }) => {
                  const toTurnOff$: Observable<ResponseStatusEnum>[] = [];
                  if (generatorStatus !== DeviceStatusEnum.TURN_OFF) {
                    toTurnOff$.push(this.generatorService.turnOff$());
                  }
                  if (patternStatus !== DeviceStatusEnum.TURN_OFF) {
                    toTurnOff$.push(this.patternService.turnOff$());
                  }
                  if (calculatorStatus !== DeviceStatusEnum.TURN_OFF) {
                    toTurnOff$.push(this.calculatorService.turnOff$());
                  }

                  return toTurnOff$.length === 0 ? of(true) : forkJoin<ResponseStatusEnum[]>(toTurnOff$).pipe(
                    tap(() => this.usbHandlerService.stopLoops()),
                    map((responses) => {
                      const hasError = responses.some((status) => status !== ResponseStatusEnum.ACK);
                      return !hasError;
                    }),
                    delay(500), // esperamos para que el usuario pueda ver que se apagaron.
                  )
                })
              );
            })
          ))
        );
      }),
    );
  }
}
