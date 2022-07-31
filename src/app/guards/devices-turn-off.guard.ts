import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { delay, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { UsbHandlerService } from '../services/usb-handler.service';
import { GeneratorService } from '../services/generator.service';
import { PatternService } from '../services/pattern.service';
import { GeneratorStatusEnum, PatternStatusEnum, ResponseStatusEnum } from '../models';
import { MessagesService } from '../services/messages.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean>;
}

@Injectable()
export class DevicesTurnOffGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(
    private readonly messagesService: MessagesService,
    private readonly usbHandlerService: UsbHandlerService,
    private readonly generatorService: GeneratorService,
    private readonly patternService: PatternService,
  ) { }

  canDeactivate(): Observable<boolean> {
    return of(this.usbHandlerService.connected$.value).pipe(
      switchMap((isConnected) => {
        if (!isConnected) {
          return of(true);
        }
        return of(false).pipe(
          switchMap(() => forkJoin({
            generatorStatus: of(this.generatorService.generatorStatus$.value),
            patternStatus: of(this.patternService.patternStatus$.value),
          }).pipe(
            switchMap(({ generatorStatus, patternStatus }) => {
              switch (generatorStatus) {
                case GeneratorStatusEnum.REQUEST_IN_PROGRESS:
                case GeneratorStatusEnum.WAITING_FOR_STABILIZATION:
                  this.messagesService.warn('Hay una operación con el hardware en curso. Aguarde un momento para que finalice y vuelva a intentar.');
                  return of(false);
              }
              switch (patternStatus) {
                case PatternStatusEnum.REQUEST_IN_PROGRESS:
                  this.messagesService.warn('Hay una operación con el hardware en curso. Aguarde un momento para que finalice y vuelva a intentar.');
                  return of(false);
              }

              if (generatorStatus === GeneratorStatusEnum.TIMEOUT) {
                if (patternStatus === PatternStatusEnum.TIMEOUT) {
                  this.messagesService.error('Ocurrió un fallo de comunicación con el hardware.');
                  return of(true);
                }
              }

              return of({ generatorStatus, patternStatus }).pipe(
                switchMap(({ generatorStatus, patternStatus }) => {
                  const toTurnOff$: Observable<ResponseStatusEnum>[] = [];
                  if (generatorStatus !== GeneratorStatusEnum.TURN_OFF) {
                    toTurnOff$.push(this.generatorService.turnOff$());
                  }
                  if (patternStatus !== PatternStatusEnum.TURN_OFF) {
                    toTurnOff$.push(this.patternService.turnOff$());
                  }
                  return toTurnOff$.length === 0 ? of(true) : forkJoin<ResponseStatusEnum[]>(toTurnOff$).pipe(
                    map((responses) => {
                      const hasError = responses.some((status) => status !== ResponseStatusEnum.ACK);
                      return !hasError;
                    }),
                    delay(500), // esperamos para que el usuario pueda ver que se apagaron.
                  )
                })
              );
            }),
          ))
        );
      }),
    );
  }
}
