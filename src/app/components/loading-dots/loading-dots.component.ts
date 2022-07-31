import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-loading-dots',
  templateUrl: './loading-dots.component.html',
  styleUrls: ['./loading-dots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingDotsComponent implements OnInit, OnDestroy {

  @Input() text: string = 'Cargando';

  readonly dots$: BehaviorSubject<'' | '.' | '..' | '...'>;
  private updateInterval: any;

  constructor() {
    this.dots$ = new BehaviorSubject<'' | '.' | '..' | '...'>('');
  }

  ngOnInit(): void {
    this.updateInterval = setInterval(() => {
      switch (this.dots$.value) {
        case '':
          return this.dots$.next('.');
        case '.':
          return this.dots$.next('..');
        case '..':
          return this.dots$.next('...');
        case '...':
          return this.dots$.next('');
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

}
