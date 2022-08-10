import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color, Static } from 'src/app/models';

@Component({
  selector: 'app-stand-used',
  templateUrl: './stand-used.component.html',
  styleUrls: ['./stand-used.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StandUsedComponent implements OnChanges {

  @Input() standUsed: Static[] = [];
  @Input() max: number = 5;

  readonly data$: BehaviorSubject<any> = new BehaviorSubject<any>({
    datasets: [{
      label: '',
      data: [],
      backgroundColor: ''
    }],
    labels: []
  });
  readonly chartOptions: any;

  constructor() {
    this.chartOptions = {
      indexAxis: 'y',
    };
  }

  private group(standUsed: Static[]): void {
    const standUsedCounters = {} as any;
    const metric: { label: string, value: number, color: string }[] = [];
    standUsed.forEach(({ tags_raw }) => {
      const { standIndex } = tags_raw as any;
      standUsedCounters[standIndex] = (standUsedCounters[standIndex] + 1) || 1;
    });
    for (const [index, key] of Object.keys(standUsedCounters).entries()) {
      const value = standUsedCounters[key];
      metric.push({
        color: Color.getColorByIndex(index, '33'),
        label: 'Puesto ' + key,
        value: value,
      });
    }
    metric.sort(({ value: a }, { value: b }) => b - a);
    const top = metric.slice(0, this.max);

    const datasets = top.map((t) => ({
      label: t.label,
      data: [t.value],
      backgroundColor: t.color
    }));

    this.data$.next({
      datasets,
      labels: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['standUsed']) {
        const standUsed = changes['standUsed'].currentValue ?? this.standUsed;
        this.group(standUsed);
      }
    }
  }

}
