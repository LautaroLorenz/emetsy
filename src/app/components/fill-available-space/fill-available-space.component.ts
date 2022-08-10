import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, ReplaySubject, takeUntil, tap } from 'rxjs';
import { ScreenService } from 'src/app/services/screen.service';

@Component({
  selector: 'app-fill-available-space',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
})
export class FillAvailableSpaceComponent implements OnInit, OnDestroy {

  @Input() componentsToSubtrac: string[] = [];

  @HostBinding('style.maxHeight.px')
  @HostBinding('style.minHeight.px')
  height: number = 0;

  private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private readonly screenService: ScreenService
  ) { }

  ngOnInit(): void {
    this.screenService.componentHeights$.pipe(
      takeUntil(this.destroyed$),
      debounceTime(100),
      tap((components) => {
        const { pMenubar, appPageTitle, windowHeight } = components;
        let extras = 0;
        for (const componentToSubtrac of this.componentsToSubtrac) {
          extras += components[componentToSubtrac] ?? 0;
        }
        this.height = windowHeight - (pMenubar + appPageTitle + extras);
      }),
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
