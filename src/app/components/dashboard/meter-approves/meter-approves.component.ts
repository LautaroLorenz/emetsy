import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Color, Static } from 'src/app/models';

@Component({
  selector: 'app-meter-approves',
  templateUrl: './meter-approves.component.html',
  styleUrls: ['./meter-approves.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeterApprovesComponent implements OnChanges {

  @Input() meterApproves: Static[] = [];
  @Input() max: number = 5;

  readonly data$: BehaviorSubject<any> = new BehaviorSubject<any>({
    datasets: [{
      data: [],
      backgroundColor: []
    }],
    labels: []
  });
  readonly chartOptions: any;

  constructor() {
    this.chartOptions = {};
  }

  private group(meterApproves: Static[]): void {
    const approvesByMeter = {} as any;
    const metric: { label: string, value: number, color: string }[] = [];
    meterApproves.forEach(({ tags_raw }) => {
      const { meter } = tags_raw as any;
      approvesByMeter[meter] = (approvesByMeter[meter] + 1) || 1;
    });
    for (const [index, key] of Object.keys(approvesByMeter).entries()) {
      const value = approvesByMeter[key];
      metric.push({
        color: Color.getColorByIndex(index, '33'),
        label: key,
        value: value,
      });
    }
    metric.sort(({ value: a }, { value: b }) => b - a);
    const top = metric.slice(0, this.max);
    this.data$.next({
      datasets: [{
        data: top.map(({ value }) => value),
        backgroundColor: top.map(({ color }) => color),
      }],
      labels: top.map(({ label }) => label),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes['meterApproves']) {
        const meterApproves = changes['meterApproves'].currentValue ?? this.meterApproves;
        this.group(meterApproves);
      }
    }
  }

}
